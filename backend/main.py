# backend/main.py

from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, DECIMAL, ForeignKey, and_
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy.sql import func
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import datetime, timedelta
import random
from dotenv import load_dotenv
import os
from typing import List, Dict, Any

load_dotenv()

#-- Database setup
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

#configuration
engine = create_engine(DATABASE_URL)
sessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models
class FlightSearchRequest(BaseModel):
    origin: str
    destination: str
    departure_date: str

class BookingRequest(BaseModel):
    flight_id: int
    passenger_name: str
    seat_number: str
class BookingResponse(BaseModel):
    message: str
    pnr: str
    total_price: float

# SQLAlchemy ORM models
class Base(DeclarativeBase):
    pass

class Airport(Base):
    __tablename__ = 'airports'
    id = Column(Integer, primary_key=True)
    code = Column(String(3), unique=True)
    name = Column(String)
    city = Column(String)
    country = Column(String)

class Airline(Base):
    __tablename__ = 'airlines'
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)

class Flight(Base):
    __tablename__ = 'flights'
    id = Column(Integer, primary_key=True)
    flight_number = Column(String, unique=True)
    airline_id = Column(Integer, ForeignKey('airlines.id'))
    origin_id = Column(Integer, ForeignKey('airports.id'))
    destination_id = Column(Integer, ForeignKey('airports.id'))
    departure_time = Column(DateTime)
    arrival_time = Column(DateTime)
    base_price = Column(DECIMAL)
    demand_level=Column(DECIMAL(4,3), default=1.0)

class Seat(Base):
    __tablename__ = 'seats'
    id = Column(Integer, primary_key=True)
    flight_id = Column(Integer, ForeignKey('flights.id'))
    seat_number = Column(String)
    is_available = Column(Boolean)
    _class=Column("class", String)

class Booking(Base):
    __tablename__="bookings"
    id = Column(Integer, primary_key=True)
    pnr=Column(String, unique=True)
    flight_id = Column(Integer, ForeignKey('flights.id'))
    passenger_name = Column(String)
    total_price = Column(DECIMAL(10,2))
    booking_date = Column(DateTime, server_default=func.now())

app = FastAPI()

# Dynamic Pricing Engine

# Pricing Tiers: Factor added to the base multiplier

PRICING_TIERS = {
    "Economy": 0.00,
    "Business": 0.30,
    "First": 0.70
}

def get_tier_factor(seat_class: str) -> float:
    return PRICING_TIERS.get(seat_class, 0.00)

def get_time_factor(departure_time:datetime)->float:
    time_difference = departure_time - datetime.now()
    days_to_departure=time_difference.total_seconds() / (60 * 60 * 24)

    if days_to_departure<0:
        return 0.5
    
    if days_to_departure<3:
        return 0.25
    elif days_to_departure<7:
        return 0.15
    elif days_to_departure<30:
        return 0.05
    elif days_to_departure<90:
        return -0.10
    else:
        return 0.00
    
def get_seat_factor(seats_available:int ,total_seats:int)->float:
    if total_seats==0:
        return 0.0
    
    percentage_available = seats_available / total_seats
    if percentage_available < 0.1:
        return 0.30
    elif percentage_available < 0.25:
        return 0.15
    elif percentage_available > 0.75:
        return -0.05
    else:
        return 0.00

def calculate_dynamic_price(flight:Flight,seat_class:str,db:Session)->float:
    base_price=float(flight.base_price)
    tier_factor=get_tier_factor(seat_class)
    time_factor=get_time_factor(flight.departure_time)

    demand_factor_multiplier=float(flight.demand_level)
    demand_factor=(demand_factor_multiplier - 1.0) 

    total_seats_in_class = db.query(Seat).filter(
        and_(Seat.flight_id == flight.id, Seat._class == seat_class)
    ).count()
    
    seats_available_in_class = db.query(Seat).filter(
        and_(Seat.flight_id == flight.id, Seat._class == seat_class, Seat.is_available == True)
    ).count()

    if total_seats_in_class == 0:
        return 0.0 
    
    seat_factor = get_seat_factor(seats_available_in_class, total_seats_in_class)

    total_factor= tier_factor + time_factor + demand_factor + seat_factor

    final_multiplier=max(1.0 + total_factor, 0.5)
    final_price=base_price * final_multiplier
    return round(final_price, 2)