import { useState, useEffect } from "react";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { motion } from "motion/react";
import { getFlightSeats } from "../../services/api";

interface Seat {
  id: number;
  seat_number: string;
  class: string;
  is_available: boolean;
}

interface SeatSelectionPageProps {
  flightData?: any;
  onNavigate: (page: string, data?: any) => void;
}

export function SeatSelectionPage({
  flightData,
  onNavigate,
}: SeatSelectionPageProps) {
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pricing, setPricing] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchSeats = async () => {
      const flightId = flightData?.flight?.flight_id || flightData?.flight?.id;

      if (!flightId) {
        setError("No flight selected");
        setLoading(false);
        return;
      }

      try {
        const response = await getFlightSeats(flightId);
        setSeats(response.seats || []);
        setPricing(response.pricing || {});
      } catch (err) {
        console.error("Error fetching seats:", err);
        setError("Failed to load seats");
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [flightData?.flight?.flight_id, flightData?.flight?.id]);

  const getSeatStatus = (seat: Seat) => {
    if (!seat.is_available) return "booked";
    if (selectedSeat === seat.seat_number) return "selected";
    if (seat.class === "First" || seat.class === "Business") return "premium";
    return "available";
  };

  const getSeatColor = (status: string) => {
    switch (status) {
      case "booked":
        return "bg-gray-300 cursor-not-allowed";
      case "selected":
        return "bg-blue-600 text-white border-blue-600";
      case "premium":
        return "bg-purple-100 border-purple-300 hover:bg-purple-200";
      default:
        return "bg-white border-gray-300 hover:bg-blue-50";
    }
  };

  const handleSeatClick = (seat: Seat) => {
    if (!seat.is_available) return;
    setSelectedSeat(seat.seat_number);
  };

  const getSelectedSeatDetails = () => {
    const seat = seats.find((s) => s.seat_number === selectedSeat);
    return seat;
  };

  // Group seats by row number
  const getSeatsByRow = () => {
    const rows: { [key: string]: Seat[] } = {};
    seats.forEach((seat) => {
      const rowNumber = seat.seat_number.match(/\d+/)?.[0] || "0";
      if (!rows[rowNumber]) {
        rows[rowNumber] = [];
      }
      rows[rowNumber].push(seat);
    });
    return rows;
  };

  const seatsByRow = getSeatsByRow();
  const sortedRows = Object.keys(seatsByRow).sort(
    (a, b) => parseInt(a) - parseInt(b)
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading available seats...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-12">
        <div className="max-w-6xl mx-auto px-6">
          <Button
            variant="ghost"
            onClick={() =>
              onNavigate("flight-details", { flight: flightData?.flight })
            }
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Flight Details
          </Button>
          <Card className="bg-white border-0 shadow-lg p-8 text-center">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <Button
              onClick={() =>
                onNavigate("flight-details", { flight: flightData?.flight })
              }
            >
              Go Back
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-6">
        <Button
          variant="ghost"
          onClick={() =>
            onNavigate("flight-details", { flight: flightData?.flight })
          }
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Flight Details
        </Button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl text-gray-900 mb-2">Select Your Seat</h1>
          <p className="text-gray-600">
            Choose your preferred seat for a comfortable journey
          </p>
        </motion.div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-white border-0 shadow-lg p-6">
                <h3 className="text-lg mb-4">Select Your Seat</h3>

                {/* Legend */}
                <div className="flex gap-4 mb-6 text-sm flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white border-2 border-gray-300 rounded"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-600 border-2 border-blue-600 rounded"></div>
                    <span>Selected</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gray-300 border-2 border-gray-300 rounded"></div>
                    <span>Booked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-100 border-2 border-purple-300 rounded"></div>
                    <span>Premium</span>
                  </div>
                </div>

                {/* Seat Map */}
                <div className="space-y-3">
                  {sortedRows.map((rowNumber) => (
                    <div key={rowNumber} className="flex items-center gap-2">
                      {/* Row Number */}
                      <div className="w-8 text-center text-sm font-bold text-gray-600">
                        {rowNumber}
                      </div>

                      {/* Seats in this row */}
                      <div className="flex gap-2 flex-1 justify-center">
                        {seatsByRow[rowNumber]
                          .sort((a, b) =>
                            a.seat_number.localeCompare(b.seat_number)
                          )
                          .map((seat) => {
                            const status = getSeatStatus(seat);
                            const color = getSeatColor(status);
                            return (
                              <motion.button
                                key={seat.id}
                                onClick={() => handleSeatClick(seat)}
                                disabled={!seat.is_available}
                                whileHover={
                                  seat.is_available ? { scale: 1.1 } : {}
                                }
                                whileTap={
                                  seat.is_available ? { scale: 0.95 } : {}
                                }
                                className={`w-12 h-12 rounded border-2 transition-all font-bold text-sm ${color} relative`}
                                title={`${seat.seat_number} - ${
                                  seat.class
                                } - $${(pricing[seat.class] || 0).toFixed(2)}`}
                              >
                                {status === "selected" ? (
                                  <Check className="w-6 h-6 mx-auto" />
                                ) : (
                                  seat.seat_number.match(/[A-Z]+/)?.[0]
                                )}
                              </motion.button>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>

                {seats.length === 0 && (
                  <p className="text-center text-gray-500 py-8">
                    No seats available for this flight
                  </p>
                )}
              </Card>
            </motion.div>
          </div>

          <div className="col-span-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              <Card className="bg-white border-0 shadow-lg p-6">
                <h3 className="text-lg mb-4">Seat Classes</h3>
                <div className="space-y-3">
                  {Object.entries(pricing).map(([seatClass, price]) => (
                    <div
                      key={seatClass}
                      className="flex items-center justify-between"
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {seatClass}
                        </p>
                      </div>
                      <p className="text-sm text-gray-600">
                        ${price.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              {selectedSeat && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <Card className="bg-gradient-to-br from-blue-600 to-blue-500 border-0 shadow-lg p-6 text-white">
                    <h3 className="text-lg mb-4">Your Selection</h3>
                    <div className="mb-4">
                      <p className="text-sm text-blue-100 mb-1">Seat Number</p>
                      <p className="text-3xl">{selectedSeat}</p>
                    </div>
                    <div className="mb-4">
                      <p className="text-sm text-blue-100 mb-1">Class</p>
                      <p className="text-xl">
                        {getSelectedSeatDetails()?.class}
                      </p>
                    </div>
                    <div className="mb-6">
                      <p className="text-sm text-blue-100 mb-1">Price</p>
                      <p className="text-2xl"></p>
                    </div>
                    <Button
                      onClick={() =>
                        onNavigate("checkout", {
                          flight: flightData?.flight,
                          seat: selectedSeat,
                          seatPrice:
                            pricing[getSelectedSeatDetails()?.class || ""] || 0,
                        })
                      }
                      className="w-full bg-white text-blue-600 hover:bg-blue-50 h-12"
                    >
                      Continue to Payment
                    </Button>
                  </Card>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
