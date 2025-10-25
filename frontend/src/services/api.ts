import axios, { AxiosInstance, AxiosError } from "axios";
import type {
  Airport,
  Airline,
  FlightSearchRequest,
  FlightSearchResult,
  FlightDetailsResponse,
  CreateBookingRequest,
  Booking,
  SeatSelectionResponse,
  UserRegister,
  UserLogin,
  AuthResponse,
  User,
  UserUpdate,
} from "../types/flight";

// API base URL - defaults to localhost in development
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Create axios instance with default config
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response) {
      console.error("API Error:", error.response.data);
    } else if (error.request) {
      console.error("Network Error:", error.message);
    }
    return Promise.reject(error);
  }
);

// ============================================================================
// Airport APIs
// ============================================================================

export const getAirports = async (): Promise<Airport[]> => {
  const response = await apiClient.get<Airport[]>("/airports");
  return response.data;
};

// ============================================================================
// Airline APIs
// ============================================================================

export const getAirlines = async (): Promise<Airline[]> => {
  const response = await apiClient.get<Airline[]>("/airlines");
  return response.data;
};

// ============================================================================
// Flight Search APIs
// ============================================================================

export const searchFlights = async (
  searchData: FlightSearchRequest
): Promise<{ flights: FlightSearchResult[] }> => {
  const response = await apiClient.post<{ flights: FlightSearchResult[] }>(
    "/flights/search",
    searchData
  );
  return response.data;
};

export const getFlightDetails = async (
  flightId: number
): Promise<FlightDetailsResponse> => {
  const response = await apiClient.get<FlightDetailsResponse>(
    `/flights/${flightId}`
  );
  return response.data;
};

// ============================================================================
// Seat Selection APIs
// ============================================================================

export const getSeatsForFlight = async (
  flightId: number,
  seatClass: string
): Promise<SeatSelectionResponse> => {
  const response = await apiClient.get<SeatSelectionResponse>(
    `/flights/${flightId}/seats`,
    { params: { class: seatClass } }
  );
  return response.data;
};

// ============================================================================
// Booking APIs
// ============================================================================

// Initiate booking (Step 1) - Reserves seat and creates pre-booking
export const initiateBooking = async (bookingData: {
  flight_id: number;
  seat_number: string;
  passenger_name: string;
  passenger_email?: string;
  passenger_phone?: string;
}): Promise<{
  message: string;
  pre_booking_id: string;
  total_price: number;
}> => {
  const response = await apiClient.post("/bookings/initiate", bookingData);
  return response.data;
};

// Process payment (Step 2) - Completes booking and generates PNR
export const processPayment = async (
  preBookingId: string
): Promise<{
  message: string;
  booking: {
    id: number;
    pnr: string;
    flight_id: number;
    passenger_name: string;
    total_price: number;
    booking_date: string;
  };
}> => {
  const response = await apiClient.post("/payment/process", {
    pre_booking_id: preBookingId,
  });
  return response.data;
};

// Get available seats for a flight
export const getFlightSeats = async (flightId: number) => {
  const response = await apiClient.get(`/flights/${flightId}/seats`);
  return response.data;
};

export const createBooking = async (
  bookingData: CreateBookingRequest
): Promise<Booking> => {
  const response = await apiClient.post<Booking>("/bookings", bookingData);
  return response.data;
};

export const getBookingByPNR = async (pnr: string): Promise<Booking> => {
  const response = await apiClient.get<Booking>(`/bookings/${pnr}`);
  return response.data;
};

export const getBookingsByEmail = async (email: string): Promise<Booking[]> => {
  const response = await apiClient.get<Booking[]>(`/bookings/email/${email}`);
  return response.data;
};

export const cancelBooking = async (
  pnr: string
): Promise<{ message: string }> => {
  const response = await apiClient.delete<{ message: string }>(
    `/bookings/${pnr}`
  );
  return response.data;
};

// ============================================================================
// Pricing APIs
// ============================================================================

export const getDynamicPrice = async (
  flightId: number,
  seatClass: string
): Promise<{ price: number }> => {
  const response = await apiClient.get<{ price: number }>(
    `/flights/${flightId}/pricing`,
    { params: { seat_class: seatClass } }
  );
  return response.data;
};

// ============================================================================
// Utility Functions
// ============================================================================

export const formatDateTime = (dateTime: string): string => {
  const date = new Date(dateTime);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const calculateDuration = (
  departure: string,
  arrival: string
): string => {
  const dep = new Date(departure);
  const arr = new Date(arrival);
  const diffMs = arr.getTime() - dep.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
};

// ============================================================================
// Authentication Functions
// ============================================================================

export const register = async (
  userData: UserRegister
): Promise<AuthResponse> => {
  const response = await apiClient.post("/auth/register", userData);
  // Store token in localStorage
  if (response.data.access_token) {
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response.data;
};

export const login = async (credentials: UserLogin): Promise<AuthResponse> => {
  const response = await apiClient.post("/auth/login", credentials);
  // Store token in localStorage
  if (response.data.access_token) {
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
};

export const getCurrentUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

export const getToken = (): string | null => {
  return localStorage.getItem("access_token");
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem("access_token");
};

export const getUserInfo = async (): Promise<User> => {
  const token = getToken();
  const response = await apiClient.get("/auth/me", {
    params: { token },
  });
  return response.data;
};

export const updateProfile = async (userData: UserUpdate): Promise<User> => {
  const token = getToken();
  const response = await apiClient.put("/auth/profile", userData, {
    params: { token },
  });
  // Update stored user data
  localStorage.setItem("user", JSON.stringify(response.data));
  return response.data;
};

export const getUserBookings = async (): Promise<Booking[]> => {
  const token = getToken();
  const response = await apiClient.get("/auth/bookings", {
    params: { token },
  });
  return response.data;
};

export default apiClient;
