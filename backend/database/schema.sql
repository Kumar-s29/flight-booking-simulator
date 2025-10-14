-- The airports table
CREATE TABLE airports (
    id SERIAL PRIMARY KEY,
    code VARCHAR(3) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL
);

-- The airlines table
CREATE TABLE airlines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL
);

-- The flights table
CREATE TABLE flights (
    id SERIAL PRIMARY KEY,
    flight_number VARCHAR(10) UNIQUE NOT NULL,
    airline_id INTEGER REFERENCES airlines(id) NOT NULL,
    origin_id INTEGER REFERENCES airports(id) NOT NULL,
    destination_id INTEGER REFERENCES airports(id) NOT NULL,
    departure_time TIMESTAMP NOT NULL,
    arrival_time TIMESTAMP NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL
);

-- The seats table
CREATE TABLE seats (
    id SERIAL PRIMARY KEY,
    flight_id INTEGER REFERENCES flights(id) NOT NULL,
    seat_number VARCHAR(5) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE NOT NULL,
    class VARCHAR(20) NOT NULL,
    UNIQUE (flight_id, seat_number)
);

-- The bookings table
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    pnr VARCHAR(10) UNIQUE NOT NULL,
    flight_id INTEGER REFERENCES flights(id) NOT NULL,
    passenger_name VARCHAR(255) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    booking_date TIMESTAMP DEFAULT NOW() NOT NULL
);
