# backend/main.py

from fastapi import FastAPI, Depends, HTTPException, status, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, DECIMAL, ForeignKey, and_, Date
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy.sql import func
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from datetime import datetime, timedelta, date
import random
import string
from dotenv import load_dotenv
import os
from typing import List, Dict, Any, Optional
import bcrypt
from jose import JWTError, jwt

load_dotenv()

# Database setup
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 hours

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

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    phone = Column(String)
    date_of_birth = Column(Date)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

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

# ============================================================================
# AUTHENTICATION MODELS
# ============================================================================

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    first_name: str
    last_name: str
    phone: Optional[str]
    date_of_birth: Optional[date]
    created_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    date_of_birth: Optional[date] = None

class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserResponse

class TokenData(BaseModel):
    email: Optional[str] = None

# ============================================================================
# AUTHENTICATION HELPER FUNCTIONS
# ============================================================================

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash using bcrypt"""
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str) -> str:
    """Hash a password using bcrypt"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(lambda: None), db: Session = Depends(get_db)) -> User:
    """Get current user from JWT token - optional authentication"""
    if not token:
        return None
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.email == token_data.email).first()
    if user is None:
        raise credentials_exception
    return user

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:3001"],  # Vite ports
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Flight Booking Simulator API"}

# ============================================================================
# AUTHENTICATION ENDPOINTS
# ============================================================================

@app.post("/auth/register", response_model=Token)
def register_user(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        password_hash=hashed_password,
        first_name=user_data.first_name,
        last_name=user_data.last_name,
        phone=user_data.phone,
        date_of_birth=user_data.date_of_birth
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": new_user.email}, expires_delta=access_token_expires
    )
    
    user_response = UserResponse.from_orm(new_user)
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )

@app.post("/auth/login", response_model=Token)
def login_user(credentials: UserLogin, db: Session = Depends(get_db)):
    """Authenticate user and return JWT token"""
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    user_response = UserResponse.from_orm(user)
    
    return Token(
        access_token=access_token,
        token_type="bearer",
        user=user_response
    )

@app.get("/auth/me", response_model=UserResponse)
def get_current_user_info(token: str, db: Session = Depends(get_db)):
    """Get current logged in user information"""
    user = get_current_user(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    return UserResponse.from_orm(user)

@app.put("/auth/profile", response_model=UserResponse)
def update_user_profile(
    user_update: UserUpdate,
    token: str,
    db: Session = Depends(get_db)
):
    """Update user profile information"""
    user = get_current_user(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    # Update fields if provided
    if user_update.first_name is not None:
        user.first_name = user_update.first_name
    if user_update.last_name is not None:
        user.last_name = user_update.last_name
    if user_update.phone is not None:
        user.phone = user_update.phone
    if user_update.date_of_birth is not None:
        user.date_of_birth = user_update.date_of_birth
    
    user.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(user)
    
    return UserResponse.from_orm(user)

@app.get("/auth/bookings", response_model=List[Dict])
def get_user_bookings(token: str, db: Session = Depends(get_db)):
    """Get all bookings for the authenticated user"""
    user = get_current_user(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    # Get bookings for this user
    bookings = db.query(Booking).filter(Booking.user_id == user.id).all()
    
    result = []
    for booking in bookings:
        flight = db.query(Flight).filter(Flight.id == booking.flight_id).first()
        if flight:
            origin = db.query(Airport).filter(Airport.id == flight.origin_id).first()
            destination = db.query(Airport).filter(Airport.id == flight.destination_id).first()
            seat = db.query(Seat).filter(Seat.id == booking.seat_id).first() if booking.seat_id else None
            
            result.append({
                "id": booking.id,
                "pnr": booking.pnr,
                "flight_id": booking.flight_id,
                "flight_number": flight.flight_number,
                "origin": {
                    "code": origin.code,
                    "name": origin.name,
                    "city": origin.city
                } if origin else None,
                "destination": {
                    "code": destination.code,
                    "name": destination.name,
                    "city": destination.city
                } if destination else None,
                "departure_time": flight.departure_time.isoformat() if flight.departure_time else None,
                "arrival_time": flight.arrival_time.isoformat() if flight.arrival_time else None,
                "passenger_name": booking.passenger_name,
                "passenger_email": booking.passenger_email,
                "passenger_phone": booking.passenger_phone,
                "seat_number": seat.seat_number if seat else None,
                "seat_class": seat._class if seat else None,
                "total_price": float(booking.total_price),
                "booking_status": booking.booking_status if hasattr(booking, 'booking_status') else 'confirmed',
                "booking_time": booking.booking_date.isoformat() if booking.booking_date else None
            })
    
    return result

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
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)  # Link to authenticated user
    passenger_name = Column(String)
    passenger_email = Column(String, nullable=True)
    passenger_phone = Column(String, nullable=True)
    seat_id = Column(Integer, ForeignKey('seats.id'), nullable=True)
    total_price = Column(DECIMAL(10,2))
    booking_status = Column(String, default='confirmed')
    booking_date = Column(DateTime, server_default=func.now())

class PreBooking(Base):
    __tablename__ = "pre_bookings"
    id = Column(Integer, primary_key=True)
    pre_booking_id = Column(String(10), unique=True)
    flight_id = Column(Integer, ForeignKey('flights.id'))
    seat_id = Column(Integer, ForeignKey('seats.id'), unique=True)  # Seat is temporarily held
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)  # Link to authenticated user
    total_price = Column(DECIMAL(10, 2))
    passenger_name = Column(String)
    passenger_email = Column(String, nullable=True)
    passenger_phone = Column(String, nullable=True)
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

# Additional API models for simplified frontend integration
class CreateBookingRequest(BaseModel):
    flight_id: int
    passenger_name: str
    passenger_email: str
    passenger_phone: str
    seat_id: int
    seat_class: str

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
def initiate_booking(
    booking_data: BookingRequest, 
    db: Session = Depends(get_db),
    authorization: Optional[str] = Header(None)
):
    # Try to get user_id from token if provided
    user_id = None
    if authorization and authorization.startswith('Bearer '):
        token = authorization.replace('Bearer ', '')
        try:
            user = get_current_user(token, db)
            if user:
                user_id = user.id
        except:
            pass  # Guest booking if token is invalid
    
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
            user_id=user_id,  # Store user_id if authenticated
            total_price=final_price,
            passenger_name=booking_data.passenger_name,
            passenger_email=booking_data.passenger_email if hasattr(booking_data, 'passenger_email') else None,
            passenger_phone=booking_data.passenger_phone if hasattr(booking_data, 'passenger_phone') else None
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
            user_id=pre_booking.user_id,  # Transfer user_id from pre-booking
            seat_id=pre_booking.seat_id,  # Store the seat information
            passenger_name=pre_booking.passenger_name,
            passenger_email=pre_booking.passenger_email,
            passenger_phone=pre_booking.passenger_phone,
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
@app.get("/bookings/{pnr}")
def get_booking_details(pnr: str, db: Session = Depends(get_db)):
    booking = db.query(Booking).filter(Booking.pnr == pnr.upper()).first()
    
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found.")

    flight = db.query(Flight).get(booking.flight_id)
    origin = db.query(Airport).get(flight.origin_id)
    destination = db.query(Airport).get(flight.destination_id)
    seat = db.query(Seat).get(booking.seat_id) if booking.seat_id else None
    
    return {
        "id": booking.id,
        "pnr": booking.pnr,
        "flight_id": booking.flight_id,
        "flight_number": flight.flight_number,
        "passenger_name": booking.passenger_name,
        "passenger_email": booking.passenger_email,
        "passenger_phone": booking.passenger_phone,
        "seat_id": booking.seat_id,
        "seat_number": seat.seat_number if seat else None,
        "seat_class": seat._class if seat else None,
        "total_price": float(booking.total_price),
        "booking_status": booking.booking_status,
        "booking_time": booking.booking_date,
        "origin": {
            "code": origin.code,
            "name": origin.name,
            "city": origin.city
        },
        "destination": {
            "code": destination.code,
            "name": destination.name,
            "city": destination.city
        },
        "departure_time": flight.departure_time,
        "arrival_time": flight.arrival_time
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

# ============================================================================
# Additional Endpoints for Frontend Integration
# ============================================================================

# Get bookings by email
@app.get("/bookings/email/{email}")
def get_bookings_by_email(email: str, db: Session = Depends(get_db)):
    """Retrieve all bookings for a given email address"""
    bookings = db.query(Booking).filter(Booking.passenger_email == email).all()
    if not bookings:
        return []
    
    results = []
    for booking in bookings:
        flight = db.query(Flight).get(booking.flight_id)
        if flight:
            origin = db.query(Airport).get(flight.origin_id)
            destination = db.query(Airport).get(flight.destination_id)
            seat = db.query(Seat).get(booking.seat_id) if booking.seat_id else None
            
            results.append({
                "id": booking.id,
                "pnr": booking.pnr,
                "flight_id": booking.flight_id,
                "flight_number": flight.flight_number,
                "passenger_name": booking.passenger_name,
                "passenger_email": booking.passenger_email,
                "passenger_phone": booking.passenger_phone,
                "seat_id": booking.seat_id,
                "seat_number": seat.seat_number if seat else None,
                "seat_class": seat._class if seat else None,
                "total_price": float(booking.total_price),
                "booking_status": booking.booking_status,
                "booking_time": booking.booking_date,
                "origin": {
                    "code": origin.code,
                    "name": origin.name,
                    "city": origin.city
                },
                "destination": {
                    "code": destination.code,
                    "name": destination.name,
                    "city": destination.city
                },
                "departure_time": flight.departure_time,
                "arrival_time": flight.arrival_time
            })
    
    return results

# Get seats for a specific flight and class
@app.get("/flights/{flight_id}/seats")
def get_flight_seats(flight_id: int, seat_class: Optional[str] = None, db: Session = Depends(get_db)):
    """Get available seats for a flight, optionally filtered by class"""
    flight = db.query(Flight).filter(Flight.id == flight_id).first()
    if not flight:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Flight not found")
    
    query = db.query(Seat).filter(Seat.flight_id == flight_id)
    
    if seat_class:
        query = query.filter(Seat._class == seat_class)
    
    seats = query.all()
    
    # Calculate pricing for each class
    pricing = {}
    unique_classes = set(s._class for s in seats)
    for cls in unique_classes:
        price = calculate_dynamic_price(flight, cls, db)
        pricing[cls] = price
    
    return {
        "seats": [
            {
                "id": s.id,
                "seat_number": s.seat_number,
                "is_available": s.is_available,
                "class": s._class,
                "flight_id": s.flight_id
            }
            for s in seats
        ],
        "pricing": pricing
    }

# Get dynamic pricing for a flight and class
@app.get("/flights/{flight_id}/pricing")
def get_flight_pricing(flight_id: int, seat_class: str = "Economy", db: Session = Depends(get_db)):
    """Get dynamic pricing for a specific flight and seat class"""
    flight = db.query(Flight).filter(Flight.id == flight_id).first()
    if not flight:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Flight not found")
    
    price = calculate_dynamic_price(flight, seat_class, db)
    
    return {"price": price}

# Create simplified booking endpoint
@app.post("/bookings")
def create_booking_simple(
    booking_data: CreateBookingRequest,
    token: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Create a new booking with seat selection (supports both authenticated and guest users)"""
    # Get user if token provided
    user = None
    if token:
        try:
            user = get_current_user(token, db)
        except HTTPException:
            pass  # Continue as guest booking
    
    # Verify flight exists
    flight = db.query(Flight).filter(Flight.id == booking_data.flight_id).first()
    if not flight:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Flight not found")
    
    # Verify seat exists and is available
    seat = db.query(Seat).filter(Seat.id == booking_data.seat_id).first()
    if not seat:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Seat not found")
    
    if not seat.is_available:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Seat is not available")
    
    # Calculate price
    total_price = calculate_dynamic_price(flight, booking_data.seat_class, db)
    
    # Generate unique PNR
    pnr = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    
    # Check PNR uniqueness
    while db.query(Booking).filter(Booking.pnr == pnr).first():
        pnr = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
    
    try:
        # Mark seat as unavailable
        seat.is_available = False
        db.add(seat)
        
        # Create booking
        new_booking = Booking(
            pnr=pnr,
            flight_id=booking_data.flight_id,
            user_id=user.id if user else None,  # Link to user if authenticated
            passenger_name=booking_data.passenger_name,
            passenger_email=booking_data.passenger_email,
            passenger_phone=booking_data.passenger_phone,
            seat_id=booking_data.seat_id,
            total_price=total_price,
            booking_status='confirmed',
            booking_date=datetime.now()
        )
        
        db.add(new_booking)
        db.commit()
        db.refresh(new_booking)
        
        return {
            "id": new_booking.id,
            "pnr": new_booking.pnr,
            "flight_id": new_booking.flight_id,
            "passenger_name": new_booking.passenger_name,
            "passenger_email": new_booking.passenger_email,
            "passenger_phone": new_booking.passenger_phone,
            "seat_id": new_booking.seat_id,
            "total_price": float(new_booking.total_price),
            "booking_status": new_booking.booking_status,
            "booking_time": new_booking.booking_time
        }
    
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Booking creation failed: {str(e)}")