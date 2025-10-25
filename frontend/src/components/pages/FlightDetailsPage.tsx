import {
  ArrowLeft,
  Plane,
  Clock,
  Briefcase,
  ShoppingBag,
  XCircle,
  CheckCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { motion } from "motion/react";

interface FlightDetailsPageProps {
  flightData?: any;
  onNavigate: (page: string, data?: any) => void;
}

export function FlightDetailsPage({
  flightData,
  onNavigate,
}: FlightDetailsPageProps) {
  const flight = flightData?.flight || {
    airline: "SkyWings Airlines",
    logo: "✈️",
    departure: "09:00 AM",
    arrival: "12:30 PM",
    duration: "3h 30m",
    stops: "Non-stop",
    price: 299,
    class: "Economy",
  };

  const fareBreakdown = [
    { label: "Base Fare", amount: 249 },
    { label: "Taxes & Fees", amount: 30 },
    { label: "Airport Charges", amount: 20 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => onNavigate("search-results")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Results
        </Button>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Flight Summary */}
              <Card className="bg-white border-0 shadow-lg p-6 mb-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-3xl">
                    {flight.logo}
                  </div>
                  <div>
                    <h2 className="text-2xl text-gray-900">{flight.airline}</h2>
                    <p className="text-gray-600">{flight.class}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-3xl text-gray-900 mb-1">
                      {flight.departure}
                    </p>
                    <p className="text-gray-600">New York (JFK)</p>
                  </div>

                  <div className="flex flex-col items-center flex-1 mx-8">
                    <div className="flex items-center gap-2 w-full mb-2">
                      <div className="h-px bg-gray-300 flex-1" />
                      <Plane className="w-5 h-5 text-blue-600 rotate-90" />
                      <div className="h-px bg-gray-300 flex-1" />
                    </div>
                    <p className="text-sm text-gray-600">{flight.duration}</p>
                    <Badge variant="outline" className="mt-2">
                      {flight.stops}
                    </Badge>
                  </div>

                  <div className="text-right">
                    <p className="text-3xl text-gray-900 mb-1">
                      {flight.arrival}
                    </p>
                    <p className="text-gray-600">Los Angeles (LAX)</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Flight Number</p>
                    <p className="text-gray-900">SW-1234</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Aircraft</p>
                    <p className="text-gray-900">Boeing 737-800</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Date</p>
                    <p className="text-gray-900">November 15, 2025</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Terminal</p>
                    <p className="text-gray-900">Terminal 4</p>
                  </div>
                </div>
              </Card>

              {/* Baggage & Services */}
              <Card className="bg-white border-0 shadow-lg p-6 mb-6">
                <h3 className="text-lg mb-4">Baggage Allowance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Briefcase className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="text-gray-900 mb-1">Cabin Bag</p>
                      <p className="text-sm text-gray-600">
                        1 piece, up to 7 kg
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShoppingBag className="w-5 h-5 text-blue-600 mt-1" />
                    <div>
                      <p className="text-gray-900 mb-1">Check-in Bag</p>
                      <p className="text-sm text-gray-600">
                        1 piece, up to 23 kg
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Fare Rules */}
              <Card className="bg-white border-0 shadow-lg p-6">
                <h3 className="text-lg mb-4">Fare Rules & Conditions</h3>
                <Accordion type="single" collapsible>
                  <AccordionItem value="cancellation">
                    <AccordionTrigger>Cancellation Policy</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                          <p>
                            Cancel more than 24 hours before departure: $50 fee
                            + fare difference
                          </p>
                        </div>
                        <div className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-600 mt-0.5" />
                          <p>
                            Cancel less than 24 hours before departure:
                            Non-refundable
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="changes">
                    <AccordionTrigger>Date Change Policy</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                          <p>Changes allowed up to 3 hours before departure</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                          <p>Change fee: $75 + fare difference</p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="refund">
                    <AccordionTrigger>Refund Policy</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 text-sm">
                        <p>
                          Refunds will be processed within 7-10 business days to
                          the original payment method.
                        </p>
                        <p>
                          Service fees and taxes may be partially refundable
                          based on airline policy.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Card>
            </motion.div>
          </div>

          {/* Price Summary Sidebar */}
          <div className="col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg p-6 sticky top-24">
                <h3 className="text-lg mb-4">Fare Summary</h3>

                <div className="space-y-3 mb-4">
                  {fareBreakdown.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="text-gray-900">${item.amount}</span>
                    </div>
                  ))}
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between mb-6">
                  <span className="text-lg">Total Amount</span>
                  <span className="text-2xl text-blue-600">
                    ${flight.price}
                  </span>
                </div>

                <Button
                  onClick={() => onNavigate("seat-selection", flightData)}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 h-12"
                >
                  Select Seat
                </Button>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-900 mb-2">💡 Price Alert</p>
                  <p className="text-xs text-blue-700">
                    Prices may change. Book now to lock this fare!
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
