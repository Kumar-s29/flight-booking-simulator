import { ArrowLeft, TrendingDown, TrendingUp, Bell, Calendar, DollarSign, AlertCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { motion } from "motion/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface FareRulesPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function FareRulesPage({ onNavigate }: FareRulesPageProps) {
  const priceHistory = [
    { date: "Oct 1", price: 320 },
    { date: "Oct 5", price: 299 },
    { date: "Oct 10", price: 315 },
    { date: "Oct 15", price: 289 },
    { date: "Oct 20", price: 305 },
    { date: "Oct 23", price: 299 },
  ];

  const fareRules = [
    {
      type: "Economy Saver",
      price: "$249",
      features: [
        { label: "Cabin Bag", included: true },
        { label: "Check-in Bag", included: false },
        { label: "Seat Selection", included: false },
        { label: "Date Change", included: false },
        { label: "Cancellation", included: false },
        { label: "Refundable", included: false },
      ],
      color: "from-blue-600 to-blue-400"
    },
    {
      type: "Economy Flex",
      price: "$299",
      features: [
        { label: "Cabin Bag", included: true },
        { label: "Check-in Bag", included: true, detail: "23kg" },
        { label: "Seat Selection", included: true },
        { label: "Date Change", included: true, detail: "$50 fee" },
        { label: "Cancellation", included: true, detail: "Within 24h" },
        { label: "Refundable", included: false },
      ],
      color: "from-green-600 to-green-400",
      recommended: true
    },
    {
      type: "Business",
      price: "$599",
      features: [
        { label: "Cabin Bag", included: true },
        { label: "Check-in Bag", included: true, detail: "32kg" },
        { label: "Seat Selection", included: true, detail: "Priority" },
        { label: "Date Change", included: true, detail: "Free" },
        { label: "Cancellation", included: true, detail: "Free" },
        { label: "Refundable", included: true },
      ],
      color: "from-purple-600 to-purple-400"
    },
  ];

  const priceAlerts = [
    { route: "NYC → LAX", currentPrice: "$299", lowestPrice: "$249", change: -17 },
    { route: "SFO → MIA", currentPrice: "$459", lowestPrice: "$399", change: -13 },
    { route: "CHI → BOS", currentPrice: "$189", lowestPrice: "$179", change: -5 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <Button
          variant="ghost"
          onClick={() => onNavigate('home')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Button>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl text-gray-900 mb-2">Fare Rules & Price History</h1>
          <p className="text-gray-600">Compare fares and track price changes</p>
        </motion.div>

        {/* Price History Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="bg-white border-0 shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl text-gray-900 mb-1">Price Trend: NYC → LAX</h2>
                <p className="text-sm text-gray-600">Last 30 days</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600 mb-1">Current Price</p>
                <p className="text-3xl text-blue-600">$299</p>
                <Badge className="bg-green-100 text-green-700 border-0 mt-2">
                  <TrendingDown className="w-3 h-3 mr-1" />
                  6% lower than avg
                </Badge>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={priceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" domain={[240, 330]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                  formatter={(value) => [`$${value}`, 'Price']}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', r: 6 }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Fare Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-2xl text-gray-900 mb-6">Compare Fare Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {fareRules.map((fare, index) => (
              <Card
                key={index}
                className={`bg-white border-2 ${
                  fare.recommended ? 'border-green-500 shadow-xl' : 'border-transparent shadow-lg'
                } relative overflow-hidden`}
              >
                {fare.recommended && (
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-4 py-1 rounded-bl-lg">
                    Recommended
                  </div>
                )}
                <div className={`h-2 bg-gradient-to-r ${fare.color}`} />
                <div className="p-6">
                  <h3 className="text-xl text-gray-900 mb-2">{fare.type}</h3>
                  <p className="text-3xl text-blue-600 mb-6">{fare.price}</p>

                  <div className="space-y-3">
                    {fare.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          feature.included ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {feature.included ? (
                            <span className="text-green-600 text-xs">✓</span>
                          ) : (
                            <span className="text-gray-400 text-xs">×</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-sm ${
                            feature.included ? 'text-gray-900' : 'text-gray-400'
                          }`}>
                            {feature.label}
                          </p>
                          {feature.detail && (
                            <p className="text-xs text-gray-500">{feature.detail}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full mt-6 ${
                      fare.recommended
                        ? 'bg-gradient-to-r from-green-600 to-green-500'
                        : 'bg-gradient-to-r from-blue-600 to-blue-500'
                    }`}
                  >
                    Select {fare.type}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Price Alerts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-white border-0 shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl text-gray-900 mb-1">Price Alerts</h2>
                <p className="text-sm text-gray-600">Get notified when prices drop</p>
              </div>
              <div className="flex items-center gap-3">
                <Label htmlFor="alerts">Enable Alerts</Label>
                <Switch id="alerts" />
              </div>
            </div>

            <div className="space-y-3">
              {priceAlerts.map((alert, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-400 rounded-lg flex items-center justify-center">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-900">{alert.route}</p>
                      <p className="text-sm text-gray-500">Current: {alert.currentPrice}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className="bg-green-100 text-green-700 border-0 mb-2">
                      <TrendingDown className="w-3 h-3 mr-1" />
                      {alert.change}%
                    </Badge>
                    <p className="text-sm text-gray-600">Lowest: {alert.lowestPrice}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 mb-1">How Price Alerts Work</p>
                <p className="text-xs text-blue-700">
                  We'll monitor prices for your saved routes and notify you via email when fares drop below your target price. You can set custom thresholds in your profile settings.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
