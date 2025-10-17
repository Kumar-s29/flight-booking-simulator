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

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# configuration
engine = create_engine(DATABASE_URL)
sessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()

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
    demand_level = Column(DECIMAL(4,3), default=1.0)

class Seat(Base):
    __tablename__ = 'seats'
    id = Column(Integer, primary_key=True)
    flight_id = Column(Integer, ForeignKey('flights.id'))
    seat_number = Column(String)
    is_available = Column(Boolean)
    _class = Column("class", String)

# Basic Pydantic models for API responses
class FlightSearchRequest(BaseModel):
    origin: str
    destination: str
    departure_date: str

class AirportListSchema(BaseModel):
    code: str
    name: str
    city: str

class AirlineListSchema(BaseModel):
    id: int
    name: str

app = FastAPI()

@app.get("/")
def read_root():
    return {"message": "Welcome to the Flight Booking Simulator API"}

# Utility Lookup Endpoints
@app.get("/airports", response_model=List[AirportListSchema])
def get_airports(db: Session = Depends(get_db)):
    """Retrieves all airports for use in search dropdowns."""
    airports = db.query(Airport).all()
    return airports

@app.get("/airlines", response_model=List[AirlineListSchema])
def get_airlines(db: Session = Depends(get_db)):
    """Retrieves all airlines."""
    airlines = db.query(Airline).all()
    return airlines

# ============================================================================
# MILESTONE 2: Dynamic Pricing Engine
# ============================================================================

# Pricing Tiers: Factor added to the base multiplier
PRICING_TIERS = {
    "Economy": 0.00,
    "Business": 0.30,
    "First": 0.70
}

def get_tier_factor(seat_class: str) -> float:
    return PRICING_TIERS.get(seat_class, 0.00)

def get_time_factor(departure_time: datetime) -> float:
    time_difference = departure_time - datetime.now()
    days_to_departure = time_difference.total_seconds() / (60 * 60 * 24)

    if days_to_departure < 0:
        return 0.5
    
    if days_to_departure < 3:
        return 0.25
    elif days_to_departure < 7:
        return 0.15
    elif days_to_departure < 30:
        return 0.05
    elif days_to_departure < 90:
        return -0.10
    else:
        return 0.00
    
def get_seat_factor(seats_available: int, total_seats: int) -> float:
    if total_seats == 0:
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

def calculate_dynamic_price(flight: Flight, seat_class: str, db: Session) -> float:
    base_price = float(flight.base_price)
    tier_factor = get_tier_factor(seat_class)
    time_factor = get_time_factor(flight.departure_time)

    demand_factor_multiplier = float(flight.demand_level)
    demand_factor = (demand_factor_multiplier - 1.0)

    total_seats_in_class = db.query(Seat).filter(
        and_(Seat.flight_id == flight.id, Seat._class == seat_class)
    ).count()
    
    seats_available_in_class = db.query(Seat).filter(
        and_(Seat.flight_id == flight.id, Seat._class == seat_class, Seat.is_available == True)
    ).count()

    if total_seats_in_class == 0:
        return 0.0 
    
    seat_factor = get_seat_factor(seats_available_in_class, total_seats_in_class)

    total_factor = tier_factor + time_factor + demand_factor + seat_factor

    final_multiplier = max(1.0 + total_factor, 0.5)
    final_price = base_price * final_multiplier
    return round(final_price, 2)

# Flight Search API Endpoints with Dynamic Pricing Integration
@app.post("/flights/search")
def search_flights(search_data: FlightSearchRequest, db: Session = Depends(get_db)):
    try:
        departure_date = datetime.strptime(search_data.departure_date, "%Y-%m-%d").date()
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid date format. Use YYYY-MM-DD.")

    origin_airport = db.query(Airport).filter(Airport.code == search_data.origin.upper()).first()
    destination_airport = db.query(Airport).filter(Airport.code == search_data.destination.upper()).first()

    if not origin_airport or not destination_airport:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Origin or destination airport not found.")
    
    flights = db.query(Flight).filter(
        Flight.origin_id == origin_airport.id,
        Flight.destination_id == destination_airport.id,
        func.date(Flight.departure_time) == departure_date
    ).all()

    if not flights:
        return {"message": "No flights found for this route and date."}
    
    results = []

    available_classes = db.query(Seat._class).filter(
        Seat.flight_id.in_([f.id for f in flights]), 
        Seat.is_available == True
    ).distinct().all()

    unique_classes = set([cls[0] for cls in available_classes])

    for flight in flights:
        flight_data: Dict[str, Any] = {
            "flight_id": flight.id,
            "flight_number": flight.flight_number,
            "origin": origin_airport.code,
            "destination": destination_airport.code,
            "departure_time": flight.departure_time,
            "arrival_time": flight.arrival_time,
            "base_economy_price": float(flight.base_price),
            "pricing": {}
        }

        for seat_class in unique_classes:
            seats_available = db.query(Seat).filter(
                and_(Seat.flight_id == flight.id, Seat.is_available == True, Seat._class == seat_class)
            ).count()
            
            if seats_available > 0:
                current_price = calculate_dynamic_price(flight, seat_class, db)
                if current_price > 0:
                    flight_data["pricing"][seat_class] = {
                        "price": current_price,
                        "seats_available": seats_available
                    }
        
        if flight_data["pricing"]:
            results.append(flight_data)
    
    return {"flights": results}

@app.get("/flights/{flight_id}")
def get_flight_details(flight_id: int, db: Session = Depends(get_db)):
    flight = db.query(Flight).filter(Flight.id == flight_id).first()
    if not flight:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Flight not found.")
    
    airline = db.query(Airline).get(flight.airline_id)
    origin = db.query(Airport).get(flight.origin_id)
    destination = db.query(Airport).get(flight.destination_id)
    seats = db.query(Seat).filter(Seat.flight_id == flight_id).all()

    unique_classes = set(s._class for s in seats)
    pricing_details = {}

    for seat_class in unique_classes:
        seats_available = db.query(Seat).filter(
            and_(Seat.flight_id == flight_id, Seat.is_available == True, Seat._class == seat_class)
        ).count()
        if seats_available > 0:
            pricing_details[seat_class] = {
                "current_price": calculate_dynamic_price(flight, seat_class, db),
                "seats_available": seats_available
            }

    seat_list = [{
        "seat_number": s.seat_number,
        "class": s._class,
        "is_available": s.is_available
    } for s in seats]

    return {
        "flight_id": flight.id,
        "flight_number": flight.flight_number,
        "airline_name": airline.name,
        "origin_airport": origin.code,
        "destination_airport": destination.code,
        "departure_time": flight.departure_time,
        "arrival_time": flight.arrival_time,
        "base_economy_price": float(flight.base_price),
        "dynamic_pricing": pricing_details,
        "seats": seat_list
    }

# Background Process to Simulate Demand/Availability Changes
@app.post("/admin/simulate_demand")
def simulate_demand_changes(db: Session = Depends(get_db)):
    """Background process to simulate real-world demand shifts"""
    flights_to_update = db.query(Flight).filter(Flight.departure_time > datetime.now()).all()
    
    updates_count = 0
    new_demand_level = 1.0
    
    for flight in flights_to_update:
        new_demand_level = round(random.uniform(0.95, 1.05), 3)
        flight.demand_level = new_demand_level
        db.add(flight)
        updates_count += 1
    
    try:
        db.commit()
        return {"message": f"Simulated demand updated for {updates_count} flights.",
                "example_demand_level": new_demand_level}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to update demand: {str(e)}")

# ============================================================================
# MILESTONE 3: Booking Workflow & Transaction Management
# ============================================================================

# Booking-related Database Models
class Booking(Base):
    __tablename__ = "bookings"
    id = Column(Integer, primary_key=True)
    pnr = Column(String, unique=True)
    flight_id = Column(Integer, ForeignKey('flights.id'))
    passenger_name = Column(String)
    total_price = Column(DECIMAL(10,2))
    booking_date = Column(DateTime, server_default=func.now())

class PreBooking(Base):
    __tablename__ = "pre_bookings"
    id = Column(Integer, primary_key=True)
    pre_booking_id = Column(String(10), unique=True)
    flight_id = Column(Integer, ForeignKey('flights.id'))
    seat_id = Column(Integer, ForeignKey('seats.id'), unique=True)  # Seat is temporarily held
    total_price = Column(DECIMAL(10, 2))
    passenger_name = Column(String)
    created_at = Column(DateTime, server_default=func.now())

# Booking-related Pydantic Models
class BookingRequest(BaseModel):
    flight_id: int
    passenger_name: str
    seat_number: str

# Response when booking initiation is successful (before payment).
class BookingInitiationResponse(BaseModel):
    message: str
    pre_booking_id: str
    total_price: float
    payment_url: str = "/api/v1/payment/process"  # Simulated redirect

# Request model for payment processing
class BookingCompletionRequest(BaseModel):
    pre_booking_id: str

class BookingResponse(BaseModel):
    message: str
    pnr: str
    total_price: float

class BookingDetails(BaseModel):
    pnr: str
    flight_number: str
    origin: str
    destination: str
    departure_time: datetime
    passenger_name: str
    total_price: float
    booking_date: datetime

# Helper Functions for Booking Management
def generate_pnr():
    return ''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', k=6))

def generate_pre_booking_id():
    return 'PB' + ''.join(random.choices('0123456789', k=8))

# Multi-Step Booking Flow with Concurrency Control

# Step 1: Step 1 of booking process: Initiates a booking, reserves the seat, calculates the final price,
# and returns a pre-booking ID for payment simulation.
# Implements concurrency control using DB transactions.
@app.post("/bookings/initiate", response_model=BookingInitiationResponse, status_code=status.HTTP_202_ACCEPTED)
def initiate_booking(booking_data: BookingRequest, db: Session = Depends(get_db)):
    seat = db.query(Seat).filter(
        and_(
            Seat.flight_id == booking_data.flight_id,
            Seat.seat_number == booking_data.seat_number
        )
    ).first()

    if not seat:
        raise HTTPException(status_code=404, detail="Seat not found.")
    if not seat.is_available:
        raise HTTPException(status_code=409, detail="Seat is already reserved or booked.")
    
    flight = db.query(Flight).get(booking_data.flight_id)
    if not flight:
        raise HTTPException(status_code=404, detail="Flight not found.")
    
    final_price = calculate_dynamic_price(flight, seat._class, db)
    
    # Check if a pre-booking already exists for this seat (concurrency control)
    existing_hold = db.query(PreBooking).filter(PreBooking.seat_id == seat.id).first()
    if existing_hold:
        raise HTTPException(status_code=409, detail="Seat is currently on hold pending payment.")

    try:
        # 1. Mark the physical seat as unavailable (hard lock for concurrency control)
        seat.is_available = False
        db.add(seat)
        
        # 2. Create a temporary Pre-Booking record
        pre_booking_id = generate_pre_booking_id()
        new_pre_booking = PreBooking(
            pre_booking_id=pre_booking_id,
            flight_id=booking_data.flight_id,
            seat_id=seat.id,
            total_price=final_price,
            passenger_name=booking_data.passenger_name
        )
        db.add(new_pre_booking)

        db.commit()
        db.refresh(new_pre_booking)
        
        return {
            "message": "Booking initiated. Proceed to payment.",
            "pre_booking_id": pre_booking_id,
            "total_price": final_price,
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail="Booking initiation failed due to a system error.")

#   Step 2 of booking process: Simulates an external payment gateway and completes the final booking transaction.
#   Generates unique PNR after successful payment.

@app.post("/payment/process", response_model=BookingResponse)
def process_payment(payment_request: BookingCompletionRequest, db: Session = Depends(get_db)):
    pre_booking = db.query(PreBooking).filter(PreBooking.pre_booking_id == payment_request.pre_booking_id).first()
    
    if not pre_booking:
        raise HTTPException(status_code=404, detail="Payment link expired or pre-booking not found.")

    # --- SIMULATE PAYMENT SUCCESS/FAILURE ---
    # 85% chance of success, 15% chance of failure
    if random.random() > 0.85:
        # Payment Fails: Must revert the seat availability
        seat_to_revert = db.query(Seat).get(pre_booking.seat_id)
        if seat_to_revert:
            seat_to_revert.is_available = True
            db.add(seat_to_revert)
        
        # Delete the pre-booking record
        db.delete(pre_booking)
        db.commit()
        
        raise HTTPException(
            status_code=status.HTTP_402_PAYMENT_REQUIRED, 
            detail="Simulated Payment Failed. Please re-try the booking."
        )
    # --- END SIMULATED PAYMENT ---

    # Payment Success: Final Transaction with PNR Generation
    try:
        # 1. Create the permanent booking record with unique PNR
        new_booking = Booking(
            pnr=generate_pnr(),
            flight_id=pre_booking.flight_id,
            passenger_name=pre_booking.passenger_name,
            total_price=pre_booking.total_price  # Use the price held during initiation
        )
        db.add(new_booking)

        # 2. Delete the temporary Pre-Booking record (the seat remains unavailable from Step 1)
        db.delete(pre_booking)

        db.commit()
        db.refresh(new_booking)

        return {
            "message": "Booking successful! Payment Confirmed and PNR assigned.", 
            "pnr": new_booking.pnr, 
            "total_price": float(new_booking.total_price)
        }
    
    except Exception as e:
        db.rollback()
        # If the commit fails here, the pre-booking might remain, requiring an external cleanup
        raise HTTPException(status_code=500, detail="Final booking record creation failed.")

# Booking History Retrieval
@app.get("/bookings/{pnr}", response_model=BookingDetails)
def get_booking_details(pnr: str, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.pnr == pnr.upper()).first()
    
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found.")

    flight = db.query(Flight).get(booking.flight_id)
    origin = db.query(Airport).get(flight.origin_id)
    destination = db.query(Airport).get(flight.destination_id)
    
    return {
        "pnr": booking.pnr,
        "flight_number": flight.flight_number,
        "origin": f"{origin.city} ({origin.code})",
        "destination": f"{destination.city} ({destination.code})",
        "departure_time": flight.departure_time,
        "passenger_name": booking.passenger_name,
        "total_price": float(booking.total_price),
        "booking_date": booking.booking_date
    }

# Booking Cancellation
# Handles the cancellation of a FINALIZED booking with concurrency safety.
# Reverts seat availability and removes booking record.
@app.delete("/bookings/{pnr}")
def cancel_booking(pnr: str, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.pnr == pnr.upper()).first()
    
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found.")

    # Find the corresponding seat. Note: A cancelled booking implies the seat is marked unavailable.
    seat = db.query(Seat).filter(
        and_(Seat.flight_id == booking.flight_id, Seat.is_available == False)
    ).first()
    
    if not seat:
        # Safety check: if the booking exists, but the seat is magically available, something is wrong
        pass 
        
    try:
        # 1. Mark the seat as available (concurrency protection)
        if seat:
            seat.is_available = True
            db.add(seat)
            
        # 2. Delete the booking record
        db.delete(booking)
        db.commit()
        return {"message": f"Booking {pnr.upper()} successfully cancelled. Seat {seat.seat_number if seat else 'N/A'} is now available."}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Cancellation failed due to a system error.")