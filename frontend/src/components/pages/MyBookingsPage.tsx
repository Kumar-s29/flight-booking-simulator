import { useState, useEffect } from "react";
import { Search, Plane, Calendar, Download, Edit, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { motion } from "motion/react";
import {
  getBookingByPNR,
  getBookingsByEmail,
  getUserBookings,
  isAuthenticated,
} from "../../services/api";
import type { Booking } from "../../types/flight";
import jsPDF from "jspdf";

interface MyBookingsPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function MyBookingsPage({ onNavigate }: MyBookingsPageProps) {
  const [pnrSearch, setPnrSearch] = useState("");
  const [emailSearch, setEmailSearch] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load user bookings on mount if authenticated
  useEffect(() => {
    const loggedIn = isAuthenticated();
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      loadUserBookings();
    }
  }, []);

  const loadUserBookings = async () => {
    setLoading(true);
    setError(null);

    try {
      const userBookings = await getUserBookings();
      setBookings(userBookings);
      if (userBookings.length === 0) {
        setError("You don't have any bookings yet");
      }
    } catch (err: any) {
      console.error("Error fetching user bookings:", err);
      setError(err.response?.data?.detail || "Failed to fetch your bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadTicket = (booking: Booking) => {
    // Create a new PDF document
    const doc = new jsPDF();

    // Set up colors
    const primaryBlue = [59, 130, 246];
    const darkBlue = [30, 64, 175];
    const green = [16, 185, 129];
    const gray = [107, 114, 128];
    const black = [17, 24, 39];

    // Header with blue background
    doc.setFillColor(primaryBlue[0], primaryBlue[1], primaryBlue[2]);
    doc.rect(0, 0, 210, 45, "F");

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("Flight Ticket", 105, 20, { align: "center" });

    // PNR
    doc.setFontSize(18);
    doc.text(`PNR: ${booking.pnr}`, 105, 32, { align: "center" });
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Booking Confirmed", 105, 40, { align: "center" });

    // Reset text color for body
    doc.setTextColor(black[0], black[1], black[2]);
    let yPos = 60;

    // Passenger Information Section
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkBlue[0], darkBlue[1], darkBlue[2]);
    doc.text("Passenger Information", 20, yPos);
    doc.setLineWidth(0.5);
    doc.setDrawColor(229, 231, 235);
    doc.line(20, yPos + 2, 190, yPos + 2);

    yPos += 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text("Name:", 25, yPos);
    doc.setTextColor(black[0], black[1], black[2]);
    doc.setFont("helvetica", "bold");
    doc.text(booking.passenger_name, 70, yPos);

    if (booking.passenger_email) {
      yPos += 8;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(gray[0], gray[1], gray[2]);
      doc.text("Email:", 25, yPos);
      doc.setTextColor(black[0], black[1], black[2]);
      doc.text(booking.passenger_email, 70, yPos);
    }

    if (booking.passenger_phone) {
      yPos += 8;
      doc.setTextColor(gray[0], gray[1], gray[2]);
      doc.text("Phone:", 25, yPos);
      doc.setTextColor(black[0], black[1], black[2]);
      doc.text(booking.passenger_phone, 70, yPos);
    }

    // Flight Information Section
    yPos += 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkBlue[0], darkBlue[1], darkBlue[2]);
    doc.text("Flight Information", 20, yPos);
    doc.line(20, yPos + 2, 190, yPos + 2);

    // Light blue background for flight details
    const flightSectionHeight =
      10 + // Base padding
      8 + // Flight number
      (booking.origin ? 8 : 0) +
      (booking.destination ? 8 : 0) +
      (booking.departure_time ? 8 : 0) +
      (booking.arrival_time ? 8 : 0) +
      (booking.seat_number ? 8 : 0) +
      5; // Extra padding

    doc.setFillColor(239, 246, 255);
    doc.rect(20, yPos + 5, 170, flightSectionHeight, "F");

    yPos += 15;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text("Flight Number:", 25, yPos);
    doc.setTextColor(black[0], black[1], black[2]);
    doc.setFont("helvetica", "bold");
    doc.text(
      booking.flight_number || booking.flight_id?.toString() || "N/A",
      70,
      yPos
    );

    if (booking.origin) {
      yPos += 8;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(gray[0], gray[1], gray[2]);
      doc.text("From:", 25, yPos);
      doc.setTextColor(black[0], black[1], black[2]);
      doc.text(`${booking.origin.city} (${booking.origin.code})`, 70, yPos);
    }

    if (booking.destination) {
      yPos += 8;
      doc.setTextColor(gray[0], gray[1], gray[2]);
      doc.text("To:", 25, yPos);
      doc.setTextColor(black[0], black[1], black[2]);
      doc.text(
        `${booking.destination.city} (${booking.destination.code})`,
        70,
        yPos
      );
    }

    if (booking.departure_time) {
      yPos += 8;
      doc.setTextColor(gray[0], gray[1], gray[2]);
      doc.text("Departure:", 25, yPos);
      doc.setTextColor(black[0], black[1], black[2]);
      doc.text(new Date(booking.departure_time).toLocaleString(), 70, yPos);
    }

    if (booking.arrival_time) {
      yPos += 8;
      doc.setTextColor(gray[0], gray[1], gray[2]);
      doc.text("Arrival:", 25, yPos);
      doc.setTextColor(black[0], black[1], black[2]);
      doc.text(new Date(booking.arrival_time).toLocaleString(), 70, yPos);
    }

    if (booking.seat_number) {
      yPos += 8;
      doc.setTextColor(gray[0], gray[1], gray[2]);
      doc.text("Seat:", 25, yPos);
      doc.setTextColor(black[0], black[1], black[2]);
      doc.text(
        `${booking.seat_number} (${booking.seat_class || "Economy"})`,
        70,
        yPos
      );
    }

    // Booking Details Section
    yPos += 20;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkBlue[0], darkBlue[1], darkBlue[2]);
    doc.text("Booking Details", 20, yPos);
    doc.line(20, yPos + 2, 190, yPos + 2);

    yPos += 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text("Booking Date:", 25, yPos);
    doc.setTextColor(black[0], black[1], black[2]);
    const bookingDate = booking.booking_time
      ? new Date(booking.booking_time).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "N/A";
    doc.text(bookingDate, 70, yPos);

    yPos += 8;
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text("Status:", 25, yPos);
    doc.setTextColor(black[0], black[1], black[2]);
    doc.setFont("helvetica", "bold");
    doc.text(booking.booking_status?.toUpperCase() || "CONFIRMED", 70, yPos);

    // Total Price (green background box)
    yPos += 18;
    doc.setFillColor(green[0], green[1], green[2]);
    doc.rect(20, yPos - 7, 170, 18, "F");
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(
      `Total Amount Paid: $${Number(booking.total_price).toFixed(2)}`,
      105,
      yPos + 4,
      { align: "center" }
    );

    // Footer
    yPos += 25;
    doc.setFillColor(249, 250, 251);
    doc.rect(0, yPos - 5, 210, 35, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text("Important:", 105, yPos + 3, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.text(
      "Please arrive at the airport at least 2 hours before departure.",
      105,
      yPos + 9,
      { align: "center" }
    );
    doc.text("Carry a valid photo ID for verification.", 105, yPos + 14, {
      align: "center",
    });
    doc.text(
      "Thank you for choosing our service! Have a pleasant journey.",
      105,
      yPos + 19,
      { align: "center" }
    );

    // Save the PDF
    doc.save(`flight-ticket-${booking.pnr}.pdf`);
  };

  const handleSearchByPNR = async () => {
    if (!pnrSearch.trim()) {
      setError("Please enter a PNR number");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const booking = await getBookingByPNR(pnrSearch.trim());
      console.log("PNR search result:", booking);
      setBookings([booking]); // Single booking in array
      setIsLoggedIn(false); // Hide "Your Bookings" section when showing search results
    } catch (err: any) {
      console.error("Error fetching booking:", err);
      setError(err.response?.data?.detail || "Booking not found");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByEmail = async () => {
    if (!emailSearch.trim()) {
      setError("Please enter an email address");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const bookingList = await getBookingsByEmail(emailSearch.trim());
      console.log("Email search results:", bookingList);
      setBookings(bookingList);
      setIsLoggedIn(false); // Hide "Your Bookings" section when showing search results
      if (bookingList.length === 0) {
        setError("No bookings found for this email");
      }
    } catch (err: any) {
      console.error("Error fetching bookings:", err);
      setError(err.response?.data?.detail || "Failed to fetch bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const activeBookings = bookings.filter(
    (b) => b.booking_status === "confirmed"
  );
  const pastBookings = bookings.filter(
    (b) => b.booking_status === "completed" || b.booking_status === "cancelled"
  );

  const renderBookingsSection = () => {
    return (
      <>
        {/* Active Bookings */}
        {activeBookings.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg text-gray-900 mb-3">Upcoming Trips</h3>
            <div className="space-y-3">
              {activeBookings.map((booking) => (
                <Card
                  key={booking.pnr}
                  className="bg-white border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                          <Plane className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="text-base text-gray-900">
                            {booking.passenger_name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            PNR: {booking.pnr}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-700 border-0">
                        {booking.booking_status.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <Plane className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Flight</p>
                          <p className="text-sm text-gray-900">
                            {booking.flight_number || `#${booking.flight_id}`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Departure</p>
                          <p className="text-sm text-gray-900">
                            {booking.departure_time
                              ? new Date(
                                  booking.departure_time
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Total</p>
                        <p className="text-lg text-blue-600">
                          ${Number(booking.total_price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                    {booking.origin && booking.destination && (
                      <div className="mb-3 text-sm text-gray-600">
                        <span className="font-medium">
                          {booking.origin.city}
                        </span>
                        {" → "}
                        <span className="font-medium">
                          {booking.destination.city}
                        </span>
                      </div>
                    )}
                    {booking.seat_number && (
                      <div className="mb-3 text-sm text-gray-600">
                        Seat:{" "}
                        <span className="font-medium">
                          {booking.seat_number}
                        </span>
                        {booking.seat_class && ` (${booking.seat_class})`}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => handleDownloadTicket(booking)}
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Ticket
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          onNavigate("manage-booking", { booking })
                        }
                        className="text-xs"
                      >
                        <Edit className="w-3 h-3 mr-1" />
                        Manage
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Past Bookings */}
        {pastBookings.length > 0 && (
          <div>
            <h3 className="text-lg text-gray-900 mb-3">Past Trips</h3>
            <div className="space-y-3">
              {pastBookings.map((booking) => (
                <Card
                  key={booking.pnr}
                  className="bg-gray-50 border border-gray-200"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <Plane className="w-5 h-5 text-gray-500" />
                        </div>
                        <div>
                          <h4 className="text-base text-gray-900">
                            {booking.passenger_name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            PNR: {booking.pnr}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={`border-0 ${
                          booking.booking_status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {booking.booking_status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl text-gray-900 mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage your flight bookings</p>
        </motion.div>

        {/* User Bookings Section - Only shown if logged in */}
        {isLoggedIn && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-white border-0 shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl">Your Bookings</h2>
                <Button
                  onClick={loadUserBookings}
                  variant="outline"
                  size="sm"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4 mr-2" />
                  )}
                  Refresh
                </Button>
              </div>

              {loading && bookings.length === 0 ? (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : error && bookings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">{error}</p>
                  <Button
                    onClick={() => onNavigate("home")}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                  >
                    <Plane className="w-4 h-4 mr-2" />
                    Book Your First Flight
                  </Button>
                </div>
              ) : bookings.length > 0 ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    You have {bookings.length} booking
                    {bookings.length > 1 ? "s" : ""}
                  </p>
                  {renderBookingsSection()}
                </div>
              ) : null}
            </Card>
          </motion.div>
        )}

        {/* Search Section - Available to all users */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: isLoggedIn ? 0.2 : 0.1 }}
        >
          <Card className="bg-white border-0 shadow-lg p-6 mb-8">
            <h2 className="text-xl mb-4">
              {isLoggedIn ? "Search Other Bookings" : "Lookup Booking"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pnr">PNR Number</Label>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="pnr"
                    placeholder="Enter PNR"
                    value={pnrSearch}
                    onChange={(e) => setPnrSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    value={emailSearch}
                    onChange={(e) => setEmailSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <Button
                onClick={handleSearchByPNR}
                disabled={loading || !pnrSearch.trim()}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                Search by PNR
              </Button>
              <Button
                onClick={handleSearchByEmail}
                disabled={loading || !emailSearch.trim()}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Search className="w-4 h-4 mr-2" />
                )}
                Search by Email
              </Button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}
          </Card>
        </motion.div>

        {/* Search Results - Only shown when search is performed */}
        {!isLoggedIn && !loading && bookings.length === 0 && !error && (
          <div className="text-center py-12">
            <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">
              Enter PNR or email to search for bookings
            </p>
          </div>
        )}

        {/* Display search results */}
        {!isLoggedIn && bookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white border-0 shadow-lg p-6">
              <h2 className="text-xl mb-4">Search Results</h2>
              {renderBookingsSection()}
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
