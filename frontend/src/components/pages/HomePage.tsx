import { useState } from "react";
import { Search, MapPin, Calendar, Users, TrendingUp, Globe, Shield, Star } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { motion } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface HomePageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [passengers, setPassengers] = useState(1);

  const featuredDestinations = [
    { city: "Paris", country: "France", price: "$499", image: "https://images.unsplash.com/photo-1431274172761-fca41d930114?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXJpcyUyMGVpZmZlbCUyMHRvd2VyfGVufDF8fHx8MTc2MTIwMjQ2N3ww&ixlib=rb-4.1.0&q=80&w=1080" },
    { city: "Dubai", country: "UAE", price: "$599", image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkdWJhaSUyMHNreWxpbmV8ZW58MXx8fHwxNzYxMjEyMzgzfDA&ixlib=rb-4.1.0&q=80&w=1080" },
    { city: "Bali", country: "Indonesia", price: "$399", image: "https://images.unsplash.com/photo-1760548814600-2ca1a3f70c81?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMGJlYWNoJTIwZGVzdGluYXRpb258ZW58MXx8fHwxNzYxMTY1MzAwfDA&ixlib=rb-4.1.0&q=80&w=1080" },
    { city: "New York", country: "USA", price: "$549", image: "https://images.unsplash.com/photo-1517144447511-aebb25bbc5fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwc2t5bGluZSUyMHRyYXZlbHxlbnwxfHx8fDE3NjExMzgxOTN8MA&ixlib=rb-4.1.0&q=80&w=1080" },
  ];

  const offers = [
    { title: "Weekend Special", discount: "30% OFF", description: "On domestic flights", color: "from-orange-500 to-pink-500" },
    { title: "Early Bird", discount: "25% OFF", description: "Book 30 days in advance", color: "from-purple-500 to-blue-500" },
    { title: "Group Booking", discount: "20% OFF", description: "For 5+ passengers", color: "from-green-500 to-teal-500" },
  ];

  const features = [
    { icon: Shield, title: "Secure Booking", description: "100% secure payment" },
    { icon: TrendingUp, title: "Best Prices", description: "Guaranteed lowest fares" },
    { icon: Globe, title: "Worldwide", description: "500+ destinations" },
    { icon: Star, title: "24/7 Support", description: "Always here to help" },
  ];

  const handleSearch = () => {
    if (from && to && departDate) {
      onNavigate('search-results', { from, to, departDate, passengers });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1716667282954-37b75707dccd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXJwbGFuZSUyMHNreSUyMHN1bnNldHxlbnwxfHx8fDE3NjExMzUyNzF8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Flight"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-600/60" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 pt-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl text-white mb-4">
              Discover Your Next Adventure
            </h1>
            <p className="text-xl text-blue-100">
              Book flights to 500+ destinations worldwide with the best prices guaranteed
            </p>
          </motion.div>

          {/* Search Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="backdrop-blur-lg bg-white/95 border-0 shadow-2xl p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="relative">
                  <label className="text-sm text-gray-600 mb-2 block">From</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Departure City"
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="text-sm text-gray-600 mb-2 block">To</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      placeholder="Destination City"
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="text-sm text-gray-600 mb-2 block">Departure Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      type="date"
                      value={departDate}
                      onChange={(e) => setDepartDate(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="relative">
                  <label className="text-sm text-gray-600 mb-2 block">Passengers</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <Input
                      type="number"
                      min="1"
                      value={passengers}
                      onChange={(e) => setPassengers(parseInt(e.target.value))}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSearch}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 h-12"
              >
                <Search className="w-5 h-5 mr-2" />
                Search Flights
              </Button>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Special Offers */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl text-center text-gray-900 mb-10">
          Special Offers
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {offers.map((offer, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`relative overflow-hidden border-0 bg-gradient-to-br ${offer.color} p-6 text-white cursor-pointer hover:scale-105 transition-transform`}>
                <Badge className="bg-white/20 text-white border-0 mb-3">Limited Time</Badge>
                <h3 className="text-xl mb-2">{offer.title}</h3>
                <p className="text-3xl mb-2">{offer.discount}</p>
                <p className="text-blue-100">{offer.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Featured Destinations */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <h2 className="text-3xl text-center text-gray-900 mb-10">
          Popular Destinations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {featuredDestinations.map((dest, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group">
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={dest.image}
                    alt={dest.city}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl mb-1">{dest.city}</h3>
                    <p className="text-sm text-gray-200">{dest.country}</p>
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">Starting from</span>
                    <span className="text-blue-600">{dest.price}</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="bg-gradient-to-b from-blue-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl text-center text-gray-900 mb-10">
            Why Choose SkyWings?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
