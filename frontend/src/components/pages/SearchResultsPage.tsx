import { useState, useEffect } from "react";
import {
  Plane,
  Filter,
  ArrowRight,
  Clock,
  Calendar,
  DollarSign,
  Loader2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Slider } from "../ui/slider";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { motion } from "motion/react";
import {
  searchFlights,
  calculateDuration,
  formatDateTime,
} from "../../services/api";
import type { FlightSearchResult } from "../../types/flight";

interface SearchResultsPageProps {
  searchData?: any;
  onNavigate: (page: string, data?: any) => void;
}

export function SearchResultsPage({
  searchData,
  onNavigate,
}: SearchResultsPageProps) {
  const [selectedFlight, setSelectedFlight] = useState<number | null>(null);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState("price");
  const [flights, setFlights] = useState<FlightSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch flights from API when component mounts or searchData changes
  useEffect(() => {
    const fetchFlights = async () => {
      // Require search parameters
      if (!searchData?.from || !searchData?.to || !searchData?.departDate) {
        setError("Please provide search criteria to find flights.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      setFlights([]);

      try {
        const response = await searchFlights({
          origin: searchData.from,
          destination: searchData.to,
          departure_date: searchData.departDate,
        });

        if (response && response.flights && Array.isArray(response.flights)) {
          setFlights(response.flights);
          if (response.flights.length === 0) {
            setError(
              "No flights found for the selected route and date. Try different search criteria."
            );
          }
        } else {
          setError("Unexpected response format from server.");
        }
      } catch (err: any) {
        console.error("Error fetching flights:", err);
        setError(
          err.response?.data?.detail ||
            "Failed to load flights. Please check your connection and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [searchData]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-12 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Searching for flights...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && flights.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-12 flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Plane className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Flights Found
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button
            onClick={() => onNavigate("home")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Back to Search
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* Error Alert (if any but flights exist) */}
        {error && flights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <Card className="bg-yellow-50 border-yellow-200 p-4">
              <p className="text-yellow-800">{error}</p>
            </Card>
          </motion.div>
        )}

        {/* Search Summary */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card className="bg-white border-0 shadow-md p-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-sm text-gray-500">From</p>
                  <p className="text-lg">{searchData?.from || "New York"}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-500">To</p>
                  <p className="text-lg">{searchData?.to || "Los Angeles"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="text-lg">
                    {searchData?.departDate || "2025-11-15"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Passengers</p>
                  <p className="text-lg">{searchData?.passengers || 1}</p>
                </div>
              </div>
              <Button variant="outline" className="border-blue-200">
                Modify Search
              </Button>
            </div>
          </Card>
        </motion.div>

        <div className="grid grid-cols-12 gap-6">
          {/* Filters Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="col-span-3"
          >
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg">Filters</h3>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <h4 className="text-sm mb-3 text-gray-700">Sort By</h4>
                <RadioGroup value={sortBy} onValueChange={setSortBy}>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="price" id="price" />
                    <Label htmlFor="price" className="cursor-pointer">
                      Lowest Price
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 mb-2">
                    <RadioGroupItem value="duration" id="duration" />
                    <Label htmlFor="duration" className="cursor-pointer">
                      Shortest Duration
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="departure" id="departure" />
                    <Label htmlFor="departure" className="cursor-pointer">
                      Earliest Departure
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm mb-3 text-gray-700">Price Range</h4>
                <Slider
                  min={0}
                  max={1000}
                  step={10}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>

              {/* Airlines Filter - TODO: Fetch from API */}
              {/* 
              <div className="mb-6">
                <h4 className="text-sm mb-3 text-gray-700">Airlines</h4>
                <p className="text-xs text-gray-500">Filters coming soon</p>
              </div>
              */}

              {/* Stops */}
              <div className="mb-6">
                <h4 className="text-sm mb-3 text-gray-700">Stops</h4>
                <div className="flex items-center space-x-2 mb-2">
                  <Checkbox id="nonstop" />
                  <label htmlFor="nonstop" className="text-sm cursor-pointer">
                    Non-stop
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="onestop" />
                  <label htmlFor="onestop" className="text-sm cursor-pointer">
                    1 stop
                  </label>
                </div>
              </div>

              <Button className="w-full bg-blue-600 hover:bg-blue-700">
                Apply Filters
              </Button>
            </Card>
          </motion.div>

          {/* Flight Results */}
          <div className="col-span-9">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">{flights.length} flights found</p>
            </div>

            <div className="space-y-4">
              {flights.map((flight, index) => {
                const economyPrice =
                  flight.pricing?.Economy?.price || flight.base_economy_price;
                const economySeats =
                  flight.pricing?.Economy?.seats_available || 0;
                const duration = calculateDuration(
                  flight.departure_time,
                  flight.arrival_time
                );

                // Extract time from datetime string (format: "2025-11-20 09:00:00")
                const getTime = (datetime: string) => {
                  const date = new Date(datetime);
                  return date.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  });
                };

                return (
                  <motion.div
                    key={flight.flight_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`bg-white border-2 transition-all cursor-pointer hover:shadow-lg ${
                        selectedFlight === flight.flight_id
                          ? "border-blue-500 shadow-lg"
                          : "border-transparent"
                      }`}
                      onClick={() => setSelectedFlight(flight.flight_id)}
                    >
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-6 flex-1">
                            {/* Airline */}
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center text-2xl">
                                ✈️
                              </div>
                              <div>
                                <p className="text-sm text-gray-900">
                                  {flight.flight_number}
                                </p>
                                <p className="text-xs text-gray-500">Economy</p>
                              </div>
                            </div>

                            {/* Flight Times */}
                            <div className="flex items-center gap-6 flex-1">
                              <div>
                                <p className="text-2xl text-gray-900">
                                  {getTime(flight.departure_time)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {flight.origin.code}
                                </p>
                              </div>

                              <div className="flex-1 flex flex-col items-center">
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="h-px bg-gray-300 flex-1" />
                                  <Plane className="w-4 h-4 text-blue-600 rotate-90" />
                                  <div className="h-px bg-gray-300 flex-1" />
                                </div>
                                <p className="text-xs text-gray-500">
                                  {duration}
                                </p>
                                <Badge
                                  variant="outline"
                                  className="mt-1 text-xs"
                                >
                                  Non-stop
                                </Badge>
                              </div>

                              <div>
                                <p className="text-2xl text-gray-900">
                                  {getTime(flight.arrival_time)}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {flight.destination.code}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Price & CTA */}
                          <div className="text-right">
                            <p className="text-3xl text-blue-600 mb-1">
                              ${economyPrice}
                            </p>
                            <p className="text-xs text-gray-500 mb-3">
                              {economySeats} seats left
                            </p>
                            <Button
                              onClick={(e) => {
                                e.stopPropagation();
                                onNavigate("flight-details", { flight });
                              }}
                              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                            >
                              View Details
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
