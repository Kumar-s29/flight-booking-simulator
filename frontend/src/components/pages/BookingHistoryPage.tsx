import { Calendar, MapPin, Plane, Download } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { motion } from "motion/react";

interface BookingHistoryPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function BookingHistoryPage({ onNavigate }: BookingHistoryPageProps) {
  const upcomingTrips = [
    {
      pnr: "SWAB12CD",
      airline: "SkyWings Airlines",
      from: "New York (JFK)",
      to: "Los Angeles (LAX)",
      date: "November 15, 2025",
      time: "09:00 AM - 12:30 PM",
      duration: "3h 30m",
      price: 299,
      status: "Confirmed",
      bookingDate: "October 20, 2025"
    },
    {
      pnr: "SWEF34GH",
      airline: "CloudJet Airways",
      from: "San Francisco (SFO)",
      to: "Miami (MIA)",
      date: "December 2, 2025",
      time: "02:00 PM - 10:30 PM",
      duration: "5h 30m",
      price: 459,
      status: "Confirmed",
      bookingDate: "October 25, 2025"
    },
  ];

  const pastTrips = [
    {
      pnr: "SWIJ56KL",
      airline: "AeroLink Express",
      from: "Chicago (ORD)",
      to: "Boston (BOS)",
      date: "September 20, 2025",
      time: "11:00 AM - 02:45 PM",
      duration: "2h 45m",
      price: 189,
      status: "Completed",
      bookingDate: "August 15, 2025"
    },
    {
      pnr: "SWMN78OP",
      airline: "SkyWings Airlines",
      from: "Los Angeles (LAX)",
      to: "Seattle (SEA)",
      date: "August 10, 2025",
      time: "07:30 AM - 10:00 AM",
      duration: "2h 30m",
      price: 229,
      status: "Completed",
      bookingDate: "July 5, 2025"
    },
    {
      pnr: "SWQR90ST",
      airline: "CloudJet Airways",
      from: "Miami (MIA)",
      to: "Denver (DEN)",
      date: "July 15, 2025",
      time: "03:00 PM - 06:45 PM",
      duration: "4h 45m",
      price: 359,
      status: "Completed",
      bookingDate: "June 10, 2025"
    },
  ];

  const TripCard = ({ trip, isUpcoming }: { trip: any; isUpcoming: boolean }) => (
    <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg text-gray-900 mb-1">{trip.airline}</h3>
            <p className="text-sm text-gray-500">PNR: {trip.pnr}</p>
          </div>
          <Badge
            className={`${
              trip.status === 'Confirmed'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-700'
            } border-0`}
          >
            {trip.status}
          </Badge>
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-4">
            <MapPin className="w-5 h-5 text-blue-600" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-gray-900">{trip.from}</span>
                <Plane className="w-4 h-4 text-gray-400 rotate-90" />
                <span className="text-gray-900">{trip.to}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-gray-900">{trip.date}</p>
              <p className="text-sm text-gray-500">{trip.time} • {trip.duration}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <p className="text-sm text-gray-500">Total Paid</p>
            <p className="text-xl text-blue-600">${trip.price}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Receipt
            </Button>
            {isUpcoming && (
              <Button
                size="sm"
                onClick={() => onNavigate('manage-booking', { booking: trip })}
                className="bg-gradient-to-r from-blue-600 to-blue-500"
              >
                Manage
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl text-gray-900 mb-2">Booking History</h1>
          <p className="text-gray-600">View all your past and upcoming trips</p>
        </motion.div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <TabsList className="bg-white border shadow-sm">
            <TabsTrigger value="upcoming">
              Upcoming Trips ({upcomingTrips.length})
            </TabsTrigger>
            <TabsTrigger value="past">
              Past Trips ({pastTrips.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingTrips.map((trip, index) => (
                <motion.div
                  key={trip.pnr}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TripCard trip={trip} isUpcoming={true} />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="past">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastTrips.map((trip, index) => (
                <motion.div
                  key={trip.pnr}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <TripCard trip={trip} isUpcoming={false} />
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <Card className="bg-gradient-to-br from-blue-600 to-blue-500 border-0 shadow-xl p-8 text-white">
            <h3 className="text-2xl mb-6">Your Travel Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Trips</p>
                <p className="text-3xl">{upcomingTrips.length + pastTrips.length}</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm mb-1">Cities Visited</p>
                <p className="text-3xl">8</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm mb-1">Miles Flown</p>
                <p className="text-3xl">12,450</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Spent</p>
                <p className="text-3xl">
                  $
                  {[...upcomingTrips, ...pastTrips].reduce((sum, trip) => sum + trip.price, 0)}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
