# Flight Booking Simulator

A full-stack flight booking application built with React, TypeScript, FastAPI, and PostgreSQL. This application simulates a complete airline booking system with features like flight search, seat selection, payment processing, and booking management.

## 🚀 Features

### User Features

- **Flight Search**: Search for flights by origin, destination, and date
- **Dynamic Pricing**: Real-time seat pricing based on class (Economy, Business, First)
- **Seat Selection**: Interactive visual seat map for selecting preferred seats
- **Secure Booking**: Complete booking workflow with passenger information
- **Payment Processing**: Simulated payment gateway integration
- **Booking Management**:
  - View all bookings
  - Search bookings by PNR or email
  - Download PDF tickets
  - Manage existing bookings
- **User Authentication**: JWT-based secure login and registration
- **User Profile**: Manage account details

### Technical Features

- **RESTful API**: FastAPI backend with comprehensive endpoints
- **Real-time Data**: Live seat availability and pricing
- **PDF Generation**: Downloadable flight tickets in PDF format
- **Responsive Design**: Mobile-friendly UI with Tailwind CSS
- **Type Safety**: Full TypeScript implementation
- **Database ORM**: SQLAlchemy for database operations
- **CORS Support**: Configured for cross-origin requests

## 🛠️ Technology Stack

### Frontend

- **React 18**: Modern React with hooks
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Smooth animations
- **Axios**: HTTP client for API calls
- **jsPDF**: PDF generation for tickets
- **Shadcn/ui**: Beautiful UI components

### Backend

- **FastAPI**: Modern Python web framework
- **Python 3.9+**: Programming language
- **PostgreSQL**: Relational database
- **SQLAlchemy**: Python ORM
- **JWT**: Secure authentication
- **Uvicorn**: ASGI server
- **Passlib**: Password hashing
- **Python-Jose**: JWT token handling

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **Python** (v3.9 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**
- **pip** (Python package manager)

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Kumar-s29/flight-booking-simulator.git
cd flight-booking-simulator
```

### 2. Database Setup

#### Create PostgreSQL Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE flight_simulator_db;

# Exit PostgreSQL
\q
```

#### Initialize Database Schema

```bash
cd backend
psql -U postgres -d flight_simulator_db -f database/schema.sql
psql -U postgres -d flight_simulator_db -f database/users_schema.sql
psql -U postgres -d flight_simulator_db -f database/seed_data.sql
```

### 3. Backend Setup

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn sqlalchemy psycopg2-binary python-jose passlib python-multipart

# Set environment variables (create a .env file)
echo "DATABASE_URL=postgresql://postgres:your_password@localhost/flight_simulator_db" > .env
echo "SECRET_KEY=your-secret-key-here" >> .env

# Run the backend server
python main.py
```

The backend will start on `http://localhost:8000`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

The frontend will start on `http://localhost:3001`

## 🗄️ Database Schema

### Main Tables

- **airports**: Airport information (code, name, city, country)
- **airlines**: Airline details
- **flights**: Flight schedules and pricing
- **seats**: Seat inventory per flight
- **users**: User accounts and authentication
- **bookings**: Confirmed flight bookings
- **pre_bookings**: Temporary booking holds during checkout

### Key Relationships

- Flights → Airports (origin/destination)
- Flights → Airlines
- Seats → Flights
- Bookings → Flights, Users, Seats

## 🔌 API Endpoints

### Authentication

- `POST /register` - Create new user account
- `POST /login` - User login
- `GET /users/me` - Get current user details

### Flights

- `GET /flights/search` - Search flights by criteria
- `GET /flights/{flight_id}` - Get flight details
- `GET /flights/{flight_id}/seats` - Get available seats for a flight

### Bookings

- `POST /bookings/initiate` - Create pre-booking (seat hold)
- `POST /payment/process` - Process payment and confirm booking
- `GET /bookings/{pnr}` - Get booking by PNR
- `GET /bookings/email/{email}` - Get all bookings for an email
- `GET /users/me/bookings` - Get authenticated user's bookings
- `DELETE /bookings/{pnr}` - Cancel booking

### Pricing

- `GET /flights/{flight_id}/pricing` - Get dynamic pricing for a flight

## 🎯 Usage Flow

### 1. Search for Flights

- Enter origin, destination, and departure date on home page
- View available flights with pricing

### 2. Select Flight

- Click on a flight to view details
- Review flight information, amenities, and policies

### 3. Choose Seat

- Visual seat map displays available seats
- Different colors for Economy, Business, First class
- See pricing for each seat class

### 4. Enter Passenger Details

- Fill in passenger information
- Review booking summary with seat and pricing

### 5. Process Payment

- Simulated payment processing
- Enter credit card details (demo mode)

### 6. Confirmation

- Receive booking confirmation with PNR
- Download PDF ticket
- View booking details

### 7. Manage Bookings

- Search by PNR or email
- View all past and upcoming trips
- Download tickets anytime

## 📱 Screenshots

### Home Page

Flight search interface with featured destinations and special offers.

### Search Results

List of available flights with filtering options.

### Seat Selection

Interactive airplane seat map with visual representation.

### Booking Confirmation

Detailed booking confirmation with PDF download option.

## 🔐 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt hashing for user passwords
- **CORS Protection**: Configured allowed origins
- **Input Validation**: Pydantic models for request validation
- **SQL Injection Prevention**: SQLAlchemy ORM parameterized queries

## 🧪 Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 📦 Project Structure

```
flight-booking-simulator/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── database/
│   │   ├── schema.sql          # Database schema
│   │   ├── users_schema.sql    # User tables
│   │   └── seed_data.sql       # Sample data
│   └── requirements.txt        # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navigation.tsx
│   │   │   ├── pages/          # Page components
│   │   │   └── ui/             # UI components
│   │   ├── services/
│   │   │   └── api.ts          # API client
│   │   ├── types/
│   │   │   └── flight.ts       # TypeScript types
│   │   └── App.tsx             # Main app component
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## 🌐 Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://username:password@localhost/flight_simulator_db
SECRET_KEY=your-secret-key-for-jwt
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:8000
```

## 🔮 Future Enhancements

- [ ] Multi-city flight search
- [ ] Round-trip bookings
- [ ] Flight cancellation and refunds
- [ ] Email notifications
- [ ] Payment gateway integration (Stripe/PayPal)
- [ ] Admin dashboard for flight management
- [ ] Real-time price updates
- [ ] Loyalty program and rewards
- [ ] Mobile app (React Native)
- [ ] Advanced seat preferences
- [ ] Baggage management
- [ ] In-flight meal selection

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

**Kumar S**

- GitHub: [@Kumar-s29](https://github.com/Kumar-s29)

## 📞 Support

For issues and questions:

- Create an issue on GitHub
- Contact: [swamykumar29603@gmail.com]

## 📊 Project Statistics

- **Frontend**: ~15,000 lines of TypeScript/TSX
- **Backend**: ~1,000 lines of Python
- **Database**: 8 main tables with relationships
- **API Endpoints**: 15+ RESTful endpoints
- **UI Components**: 30+ reusable components

---

⭐ If you found this project helpful, please star the repository!

**Happy Flying! ✈️**
