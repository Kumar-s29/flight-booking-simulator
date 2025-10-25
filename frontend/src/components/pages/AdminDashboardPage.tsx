import { DollarSign, Users, Plane, TrendingUp, Calendar, Settings } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { motion } from "motion/react";

interface AdminDashboardPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function AdminDashboardPage({ onNavigate }: AdminDashboardPageProps) {
  const stats = [
    { label: "Total Revenue", value: "$124,500", change: "+12.5%", icon: DollarSign, color: "from-green-600 to-green-400" },
    { label: "Total Bookings", value: "1,234", change: "+8.2%", icon: Users, color: "from-blue-600 to-blue-400" },
    { label: "Active Flights", value: "48", change: "+5.1%", icon: Plane, color: "from-purple-600 to-purple-400" },
    { label: "Avg. Occupancy", value: "78%", change: "+3.7%", icon: TrendingUp, color: "from-orange-600 to-orange-400" },
  ];

  const recentBookings = [
    { pnr: "SWAB12CD", passenger: "John Doe", route: "NYC → LAX", date: "Nov 15", amount: "$299", status: "Confirmed" },
    { pnr: "SWEF34GH", passenger: "Jane Smith", route: "SFO → MIA", date: "Nov 18", amount: "$459", status: "Confirmed" },
    { pnr: "SWIJ56KL", passenger: "Bob Johnson", route: "CHI → BOS", date: "Nov 20", amount: "$189", status: "Pending" },
    { pnr: "SWMN78OP", passenger: "Alice Brown", route: "LAX → SEA", date: "Nov 22", amount: "$349", status: "Confirmed" },
    { pnr: "SWQR90ST", passenger: "Charlie Wilson", route: "MIA → DEN", date: "Nov 25", amount: "$279", status: "Cancelled" },
  ];

  const upcomingFlights = [
    { flight: "SW-1234", route: "NYC → LAX", departure: "09:00 AM", seats: "156/180", status: "On Time" },
    { flight: "SW-5678", route: "SFO → MIA", departure: "11:30 AM", seats: "142/180", status: "On Time" },
    { flight: "SW-9012", route: "CHI → BOS", departure: "02:00 PM", seats: "165/180", status: "Delayed" },
    { flight: "SW-3456", route: "LAX → SEA", departure: "04:30 PM", seats: "128/180", status: "On Time" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Overview of flight operations and bookings</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => onNavigate('analytics')}
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-500">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-white border-0 shadow-lg overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${stat.color}`} />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-0">
                      {stat.change}
                    </Badge>
                  </div>
                  <h3 className="text-2xl text-gray-900 mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white border-0 shadow-lg p-6">
              <h2 className="text-xl text-gray-900 mb-4">Recent Bookings</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PNR</TableHead>
                    <TableHead>Passenger</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentBookings.map((booking) => (
                    <TableRow key={booking.pnr}>
                      <TableCell>{booking.pnr}</TableCell>
                      <TableCell>{booking.passenger}</TableCell>
                      <TableCell className="text-sm text-gray-600">{booking.route}</TableCell>
                      <TableCell>{booking.amount}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            booking.status === 'Confirmed'
                              ? 'bg-green-100 text-green-700'
                              : booking.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          } border-0`}
                        >
                          {booking.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </motion.div>

          {/* Upcoming Flights */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white border-0 shadow-lg p-6">
              <h2 className="text-xl text-gray-900 mb-4">Upcoming Flights</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Flight</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Departure</TableHead>
                    <TableHead>Seats</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingFlights.map((flight) => (
                    <TableRow key={flight.flight}>
                      <TableCell>{flight.flight}</TableCell>
                      <TableCell className="text-sm text-gray-600">{flight.route}</TableCell>
                      <TableCell className="text-sm">{flight.departure}</TableCell>
                      <TableCell className="text-sm">{flight.seats}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            flight.status === 'On Time'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          } border-0`}
                        >
                          {flight.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white border-0 shadow-lg p-6">
            <h2 className="text-xl text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Plane className="w-6 h-6" />
                <span>Add Flight</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Users className="w-6 h-6" />
                <span>View Passengers</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <Calendar className="w-6 h-6" />
                <span>Schedule</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col gap-2">
                <TrendingUp className="w-6 h-6" />
                <span>Reports</span>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
