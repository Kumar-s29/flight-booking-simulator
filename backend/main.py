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