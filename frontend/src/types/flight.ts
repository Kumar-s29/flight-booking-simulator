// TypeScript interfaces matching backend models

export interface Airport {
  id: number;
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface Airline {
  id: number;
  name: string;
}

export interface Seat {
  id: number;
  flight_id: number;
  seat_number: string;
  is_available: boolean;
  class: string;
}

export interface Flight {
  id: number;
  flight_number: string;
  airline_id: number;
  origin_id: number;
  destination_id: number;
  departure_time: string;
  arrival_time: string;
  base_price: number;
  demand_level: number;
}

export interface FlightSearchResult {
  flight_id: number;
  flight_number: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  base_economy_price: number;
  pricing: {
    [key: string]: {
      price: number;
      seats_available: number;
    };
  };
}

export interface FlightSearchRequest {
  origin: string;
  destination: string;
  departure_date: string;
}

export interface FlightDetailsResponse {
  flight: Flight;
  airline: Airline;
  origin: Airport;
  destination: Airport;
  seats: Seat[];
  pricing: {
    [key: string]: {
      price: number;
      seats_available: number;
    };
  };
}

export interface Booking {
  id: number;
  pnr: string;
  flight_id: number;
  flight_number?: string;
  passenger_name: string;
  passenger_email?: string;
  passenger_phone?: string;
  seat_id?: number;
  seat_number?: string;
  seat_class?: string;
  total_price: number;
  booking_status: string;
  booking_time: string;
  origin?: {
    code: string;
    name: string;
    city: string;
  };
  destination?: {
    code: string;
    name: string;
    city: string;
  };
  departure_time?: string;
  arrival_time?: string;
}

export interface CreateBookingRequest {
  flight_id: number;
  passenger_name: string;
  passenger_email: string;
  passenger_phone: string;
  seat_id: number;
  seat_class: string;
}

export interface SeatSelectionResponse {
  seats: Seat[];
  pricing: {
    [key: string]: number;
  };
}

// Authentication Types
export interface UserRegister {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  phone?: string;
  date_of_birth?: string;
}

export interface UserLogin {
  email: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  date_of_birth?: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface UserUpdate {
  first_name?: string;
  last_name?: string;
  phone?: string;
  date_of_birth?: string;
}
