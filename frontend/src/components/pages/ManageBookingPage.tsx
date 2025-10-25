import { ArrowLeft, AlertTriangle, RefreshCw, XCircle, DollarSign, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription } from "../ui/alert";
import { Separator } from "../ui/separator";
import { motion } from "motion/react";

interface ManageBookingPageProps {
  bookingData?: any;
  onNavigate: (page: string, data?: any) => void;
}

export function ManageBookingPage({ bookingData, onNavigate }: ManageBookingPageProps) {
  const booking = bookingData?.booking || {
    pnr: "SWAB12CD",
    airline: "SkyWings Airlines",
    route: "New York → Los Angeles",
    date: "Nov 15, 2025",
    time: "09:00 AM - 12:30 PM",
    price: 299
  };

  const isCancel = bookingData?.action === 'cancel';

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-6">
        <Button
          variant="ghost"
          onClick={() => onNavigate('my-bookings')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to My Bookings
        </Button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl text-gray-900 mb-2">
            {isCancel ? 'Cancel Booking' : 'Manage Booking'}
          </h1>
          <p className="text-gray-600">PNR: {booking.pnr}</p>
        </motion.div>

        {/* Booking Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-white border-0 shadow-lg p-6 mb-6">
            <h2 className="text-xl mb-4">Booking Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Airline</span>
                <span className="text-gray-900">{booking.airline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Route</span>
                <span className="text-gray-900">{booking.route}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date</span>
                <span className="text-gray-900">{booking.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time</span>
                <span className="text-gray-900">{booking.time}</span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between">
                <span className="text-lg text-gray-600">Total Amount</span>
                <span className="text-2xl text-blue-600">${booking.price}</span>
              </div>
            </div>
          </Card>
        </motion.div>

        {isCancel ? (
          <>
            {/* Cancellation Policy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Alert className="mb-6 border-orange-200 bg-orange-50">
                <AlertTriangle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-900">
                  Please review the cancellation policy before proceeding
                </AlertDescription>
              </Alert>

              <Card className="bg-white border-0 shadow-lg p-6 mb-6">
                <h2 className="text-xl mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  Cancellation Details
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <h3 className="text-sm mb-2 text-red-900">Cancellation Charges</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-red-700">Cancellation Fee</span>
                        <span className="text-red-900">$50</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-red-700">Airline Charges</span>
                        <span className="text-red-900">$25</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="text-sm mb-2 text-green-900">Refund Amount</h3>
                    <div className="flex justify-between">
                      <span className="text-green-700">Amount to be refunded</span>
                      <span className="text-2xl text-green-600">${booking.price - 75}</span>
                    </div>
                    <p className="text-xs text-green-700 mt-2">
                      Refund will be processed in 7-10 business days
                    </p>
                  </div>
                </div>

                <Separator className="my-6" />

                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => onNavigate('my-bookings')}
                    className="flex-1"
                  >
                    Keep Booking
                  </Button>
                  <Button className="flex-1 bg-red-600 hover:bg-red-700">
                    <XCircle className="w-4 h-4 mr-2" />
                    Confirm Cancellation
                  </Button>
                </div>
              </Card>
            </motion.div>
          </>
        ) : (
          <>
            {/* Manage Options */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <Card className="bg-white border-0 shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg text-gray-900">Change Date/Flight</h3>
                      <p className="text-sm text-gray-600">Modify your travel date or switch to another flight</p>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-blue-600 to-blue-500">
                    Change Flight
                  </Button>
                </div>
              </Card>

              <Card className="bg-white border-0 shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                      <RefreshCw className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-lg text-gray-900">Upgrade Class</h3>
                      <p className="text-sm text-gray-600">Upgrade to Business or First Class</p>
                    </div>
                  </div>
                  <Button className="bg-gradient-to-r from-purple-600 to-purple-500">
                    View Options
                  </Button>
                </div>
              </Card>

              <Card className="bg-white border-0 shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg text-gray-900">Request Refund</h3>
                      <p className="text-sm text-gray-600">Get a full or partial refund</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => onNavigate('manage-booking', { booking, action: 'cancel' })}
                    className="bg-gradient-to-r from-green-600 to-green-500"
                  >
                    Request
                  </Button>
                </div>
              </Card>

              <Card className="bg-white border-0 shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="text-lg text-gray-900">Cancel Booking</h3>
                      <p className="text-sm text-gray-600">Cancel your entire booking</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => onNavigate('manage-booking', { booking, action: 'cancel' })}
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    Cancel
                  </Button>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
