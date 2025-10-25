import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Smartphone,
  Wallet,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Separator } from "../ui/separator";
import { motion } from "motion/react";
import { initiateBooking, processPayment } from "../../services/api";

interface CheckoutPageProps {
  flightData?: any;
  onNavigate: (page: string, data?: any) => void;
}

export function CheckoutPage({ flightData, onNavigate }: CheckoutPageProps) {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    gender: "",
  });

  const flight = flightData?.flight || {
    airline: "SkyWings Airlines",
    departure: "09:00 AM",
    arrival: "12:30 PM",
    price: 299,
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Step 1: Initiate booking (reserves seat)
      const passengerName = `${formData.firstName} ${formData.lastName}`;
      const initiateResponse = await initiateBooking({
        flight_id: flightData?.flightId || flightData?.flight?.id || 1,
        seat_number: flightData?.seat || flightData?.selectedSeat || "1A",
        passenger_name: passengerName,
        passenger_email: formData.email,
        passenger_phone: formData.phone,
      });

      console.log("Booking initiated:", initiateResponse);

      // Step 2: Process payment (completes booking)
      const paymentResponse = await processPayment(
        initiateResponse.pre_booking_id
      );

      console.log("Payment processed:", paymentResponse);

      // Navigate to confirmation page with booking details
      onNavigate("confirmation", {
        booking: paymentResponse.booking,
        passenger: formData,
        flight: flightData?.flight,
        selectedSeat: flightData?.seat || flightData?.selectedSeat,
      });
    } catch (err: any) {
      console.error("Booking error:", err);
      setError(
        err.response?.data?.detail || "Booking failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl text-gray-900 mb-2">Complete Your Booking</h1>
          <p className="text-gray-600">
            Just a few more steps to confirm your flight
          </p>
        </motion.div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Form */}
          <div className="col-span-8">
            <form onSubmit={handleSubmit}>
              {/* Passenger Details */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-white border-0 shadow-lg p-6 mb-6">
                  <h2 className="text-xl mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-600" />
                    Passenger Details
                  </h2>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            firstName: e.target.value,
                          })
                        }
                        placeholder="John"
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) =>
                          setFormData({ ...formData, lastName: e.target.value })
                        }
                        placeholder="Doe"
                        required
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <Label htmlFor="age">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) =>
                          setFormData({ ...formData, age: e.target.value })
                        }
                        placeholder="30"
                        required
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender *</Label>
                      <Select
                        onValueChange={(value: string) =>
                          setFormData({ ...formData, gender: value })
                        }
                        required
                      >
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        ```
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <h3 className="text-lg mb-4">Contact Information</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <div className="relative mt-2">
                        <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="john@example.com"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number *</Label>
                      <div className="relative mt-2">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="+1 234 567 8900"
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              {/* Payment Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-white border-0 shadow-lg p-6 mb-6">
                  <h2 className="text-xl mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    Payment Method
                  </h2>

                  <RadioGroup
                    value={paymentMethod}
                    onValueChange={setPaymentMethod}
                    className="mb-6"
                  >
                    <div className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:border-blue-300 transition-colors mb-3 border-blue-500">
                      <RadioGroupItem value="card" id="card" />
                      <Label
                        htmlFor="card"
                        className="flex items-center gap-2 cursor-pointer flex-1"
                      >
                        <CreditCard className="w-5 h-5" />
                        Credit / Debit Card
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:border-blue-300 transition-colors mb-3">
                      <RadioGroupItem value="upi" id="upi" />
                      <Label
                        htmlFor="upi"
                        className="flex items-center gap-2 cursor-pointer flex-1"
                      >
                        <Smartphone className="w-5 h-5" />
                        UPI Payment
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 border-2 rounded-lg cursor-pointer hover:border-blue-300 transition-colors">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label
                        htmlFor="wallet"
                        className="flex items-center gap-2 cursor-pointer flex-1"
                      >
                        <Wallet className="w-5 h-5" />
                        Digital Wallet
                      </Label>
                    </div>
                  </RadioGroup>

                  {paymentMethod === "card" && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="cardNumber">Card Number</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          className="mt-2"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="expiry">Expiry Date</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            type="password"
                            maxLength={3}
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "upi" && (
                    <div>
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input
                        id="upiId"
                        placeholder="yourname@upi"
                        className="mt-2"
                      />
                    </div>
                  )}
                </Card>
              </motion.div>

              {/* Error Display */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 h-12"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  `Confirm & Pay $${
                    flight.price + (flightData?.seatPrice || 0)
                  }`
                )}
              </Button>
            </form>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg p-6 sticky top-24">
                <h3 className="text-lg mb-4">Booking Summary</h3>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Flight</p>
                  <p className="text-gray-900">{flight.airline}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Route</p>
                  <p className="text-gray-900">New York → Los Angeles</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Departure</p>
                  <p className="text-gray-900">{flight.departure}</p>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-600 mb-1">Arrival</p>
                  <p className="text-gray-900">{flight.arrival}</p>
                </div>

                {flightData?.seat && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Seat</p>
                    <p className="text-gray-900">{flightData.seat}</p>
                  </div>
                )}

                <Separator className="my-4" />

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Fare</span>
                    <span className="text-gray-900">${flight.price - 50}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="text-gray-900">$50</span>
                  </div>
                  {flightData?.seatPrice && flightData.seatPrice > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Seat Selection</span>
                      <span className="text-gray-900">
                        ${flightData.seatPrice}
                      </span>
                    </div>
                  )}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between mb-6">
                  <span className="text-lg">Total</span>
                  <span className="text-2xl text-blue-600">
                    ${flight.price + (flightData?.seatPrice || 0)}
                  </span>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-900">
                    ✓ Instant Confirmation
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    You'll receive booking details via email
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
