import {
  CheckCircle,
  Download,
  Mail,
  Plane,
  Calendar,
  User,
  MapPin,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";

interface BookingConfirmationPageProps {
  bookingData?: any;
  onNavigate: (page: string, data?: any) => void;
}

export function BookingConfirmationPage({
  bookingData,
  onNavigate,
}: BookingConfirmationPageProps) {
  const [showConfetti, setShowConfetti] = useState(true);

  // Use actual PNR from booking response or generate a mock one
  const pnr =
    bookingData?.booking?.pnr ||
    "SW" + Math.random().toString(36).substr(2, 6).toUpperCase();
  const flight = bookingData?.flight || {
    airline: "SkyWings Airlines",
    departure: "09:00 AM",
    arrival: "12:30 PM",
    price: 299,
  };
  const passenger = bookingData?.passenger || {
    firstName: "John",
    lastName: "Doe",
    email: "john@example.com",
  };
  const totalPrice = bookingData?.booking?.total_price || flight.price;

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadTicket = () => {
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
    doc.text(`PNR: ${pnr}`, 105, 32, { align: "center" });
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
    doc.text(`${passenger.firstName} ${passenger.lastName}`, 70, yPos);

    yPos += 8;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text("Email:", 25, yPos);
    doc.setTextColor(black[0], black[1], black[2]);
    doc.text(passenger.email, 70, yPos);

    if (passenger.phone) {
      yPos += 8;
      doc.setTextColor(gray[0], gray[1], gray[2]);
      doc.text("Phone:", 25, yPos);
      doc.setTextColor(black[0], black[1], black[2]);
      doc.text(passenger.phone, 70, yPos);
    }

    // Flight Information Section
    yPos += 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(darkBlue[0], darkBlue[1], darkBlue[2]);
    doc.text("Flight Information", 20, yPos);
    doc.line(20, yPos + 2, 190, yPos + 2);

    // Light blue background for flight details
    doc.setFillColor(239, 246, 255);
    doc.rect(20, yPos + 5, 170, 55, "F");

    yPos += 15;
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text("Airline:", 25, yPos);
    doc.setTextColor(black[0], black[1], black[2]);
    doc.setFont("helvetica", "bold");
    doc.text(flight.airline || "SkyWings Airlines", 70, yPos);

    yPos += 8;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text("Flight Number:", 25, yPos);
    doc.setTextColor(black[0], black[1], black[2]);
    doc.text(bookingData?.booking?.flight_id?.toString() || "N/A", 70, yPos);

    yPos += 8;
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text("Departure:", 25, yPos);
    doc.setTextColor(black[0], black[1], black[2]);
    doc.text(flight.departure || "N/A", 70, yPos);

    yPos += 8;
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text("Arrival:", 25, yPos);
    doc.setTextColor(black[0], black[1], black[2]);
    doc.text(flight.arrival || "N/A", 70, yPos);

    if (bookingData?.selectedSeat) {
      yPos += 8;
      doc.setTextColor(gray[0], gray[1], gray[2]);
      doc.text("Seat:", 25, yPos);
      doc.setTextColor(black[0], black[1], black[2]);
      doc.text(bookingData.selectedSeat, 70, yPos);
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
    doc.text(
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      70,
      yPos
    );

    yPos += 8;
    doc.setTextColor(gray[0], gray[1], gray[2]);
    doc.text("Status:", 25, yPos);
    doc.setTextColor(black[0], black[1], black[2]);
    doc.setFont("helvetica", "bold");
    doc.text("CONFIRMED", 70, yPos);

    // Total Price (green background box)
    yPos += 18;
    doc.setFillColor(green[0], green[1], green[2]);
    doc.rect(20, yPos - 7, 170, 18, "F");
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(
      `Total Amount Paid: $${Number(totalPrice).toFixed(2)}`,
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
    doc.save(`flight-ticket-${pnr}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-12 relative overflow-hidden">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              initial={{
                opacity: 1,
                y: -20,
                x: Math.random() * window.innerWidth,
              }}
              animate={{
                opacity: 0,
                y: window.innerHeight,
                rotate: Math.random() * 360,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 0.5,
              }}
              className="absolute w-2 h-2 rounded-full"
              style={{
                backgroundColor: [
                  "#3b82f6",
                  "#10b981",
                  "#f59e0b",
                  "#ef4444",
                  "#8b5cf6",
                ][i % 5],
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-xl text-gray-600">
            Your flight has been successfully booked
          </p>
        </motion.div>

        {/* PNR Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-blue-600 to-blue-500 border-0 shadow-xl p-8 mb-6 text-white">
            <div className="text-center">
              <p className="text-sm text-blue-100 mb-2">Your PNR Number</p>
              <p className="text-5xl tracking-wider mb-4">{pnr}</p>
              <p className="text-sm text-blue-100">
                Please save this for future reference
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Flight Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white border-0 shadow-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl text-gray-900">Flight Details</h2>
              <Badge className="bg-green-100 text-green-700 border-0">
                Confirmed
              </Badge>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3">
                <Plane className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Airline</p>
                  <p className="text-gray-900">{flight.airline}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Route</p>
                  <p className="text-gray-900">
                    New York (JFK) → Los Angeles (LAX)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Date & Time</p>
                  <p className="text-gray-900">
                    November 15, 2025 | {flight.departure} - {flight.arrival}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Passenger</p>
                  <p className="text-gray-900">
                    {passenger.firstName} {passenger.lastName}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex justify-between items-center">
              <span className="text-lg text-gray-600">Total Amount Paid</span>
              <span className="text-2xl text-blue-600">
                ${Number(totalPrice).toFixed(2)}
              </span>
            </div>
          </Card>
        </motion.div>

        {/* Important Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-blue-50 border-blue-200 p-6 mb-6">
            <h3 className="text-lg text-gray-900 mb-3">
              Important Information
            </h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                <span>Check-in opens 24 hours before departure</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                <span>
                  Arrive at the airport at least 2 hours before departure
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                <span>Carry a valid government-issued ID</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5" />
                <span>
                  Confirmation email has been sent to {passenger.email}
                </span>
              </li>
            </ul>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Button
            variant="outline"
            onClick={handleDownloadTicket}
            className="h-12 border-blue-200 hover:bg-blue-50"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
          <Button
            variant="outline"
            className="h-12 border-blue-200 hover:bg-blue-50"
          >
            <Mail className="w-4 h-4 mr-2" />
            Email Confirmation
          </Button>
          <Button
            onClick={() => onNavigate("my-bookings")}
            className="h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
          >
            View My Bookings
          </Button>
        </motion.div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate("home")}
            className="text-blue-600 hover:text-blue-700"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
