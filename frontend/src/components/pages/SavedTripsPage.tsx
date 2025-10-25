import { Bookmark, MapPin, Calendar, Plane, Trash2, Edit, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { motion } from "motion/react";

interface SavedTripsPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function SavedTripsPage({ onNavigate }: SavedTripsPageProps) {
  const savedTrips = [
    {
      id: 1,
      name: "Weekend Gateway to LA",
      from: "New York (JFK)",
      to: "Los Angeles (LAX)",
      tripType: "Round Trip",
      passengers: 2,
      class: "Economy",
      frequency: "Used 5 times",
      lastUsed: "October 2025",
      estimatedPrice: "$599"
    },
    {
      id: 2,
      name: "Business Trip to Miami",
      from: "San Francisco (SFO)",
      to: "Miami (MIA)",
      tripType: "One Way",
      passengers: 1,
      class: "Business",
      frequency: "Used 12 times",
      lastUsed: "September 2025",
      estimatedPrice: "$899"
    },
    {
      id: 3,
      name: "Family Vacation to Hawaii",
      from: "Los Angeles (LAX)",
      to: "Honolulu (HNL)",
      tripType: "Round Trip",
      passengers: 4,
      class: "Economy",
      frequency: "Used 2 times",
      lastUsed: "July 2025",
      estimatedPrice: "$1,599"
    },
  ];

  const frequentRoutes = [
    { route: "NYC → LAX", bookings: 15, avgPrice: "$299" },
    { route: "SFO → MIA", bookings: 12, avgPrice: "$459" },
    { route: "CHI → BOS", bookings: 8, avgPrice: "$189" },
    { route: "LAX → SEA", bookings: 6, avgPrice: "$229" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl text-gray-900 mb-2">Saved Trips & Templates</h1>
          <p className="text-gray-600">Quick access to your frequent itineraries</p>
        </motion.div>

        {/* Saved Trip Templates */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl text-gray-900">Your Templates</h2>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-500">
              <Plus className="w-4 h-4 mr-2" />
              Create New Template
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savedTrips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white border-0 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                          <Bookmark className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg text-gray-900 mb-1">{trip.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {trip.frequency}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <div className="flex items-center gap-2 flex-1">
                          <span className="text-sm text-gray-900">{trip.from}</span>
                          <Plane className="w-3 h-3 text-gray-400 rotate-90" />
                          <span className="text-sm text-gray-900">{trip.to}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">Type</p>
                          <p className="text-gray-900">{trip.tripType}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Passengers</p>
                          <p className="text-gray-900">{trip.passengers}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Class</p>
                          <p className="text-gray-900">{trip.class}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div>
                          <p className="text-xs text-gray-500">Estimated Price</p>
                          <p className="text-lg text-blue-600">{trip.estimatedPrice}</p>
                        </div>
                        <Button
                          onClick={() => onNavigate('search-results', { template: trip })}
                          className="bg-gradient-to-r from-blue-600 to-blue-500"
                        >
                          Search Flights
                        </Button>
                      </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">
                      Last used: {trip.lastUsed}
                    </p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Frequent Routes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl text-gray-900 mb-6">Frequent Routes</h2>
          <Card className="bg-white border-0 shadow-lg p-6">
            <div className="space-y-4">
              {frequentRoutes.map((route, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => onNavigate('search-results', { route })}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-400 rounded-lg flex items-center justify-center">
                      <Plane className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-900">{route.route}</p>
                      <p className="text-sm text-gray-500">{route.bookings} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg text-blue-600">{route.avgPrice}</p>
                    <p className="text-xs text-gray-500">Avg. price</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <Card className="bg-gradient-to-br from-blue-600 to-blue-500 border-0 shadow-xl p-6 text-white">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                💡
              </div>
              <div>
                <h3 className="text-lg mb-2">Pro Tip</h3>
                <p className="text-blue-100">
                  Save your frequently used itineraries as templates to book flights faster. We'll also track price changes and notify you of better deals!
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
