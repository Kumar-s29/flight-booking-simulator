import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { motion } from "motion/react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface AnalyticsPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function AnalyticsPage({ onNavigate }: AnalyticsPageProps) {
  const revenueData = [
    { month: 'Jan', revenue: 45000, bookings: 420 },
    { month: 'Feb', revenue: 52000, bookings: 480 },
    { month: 'Mar', revenue: 48000, bookings: 450 },
    { month: 'Apr', revenue: 61000, bookings: 580 },
    { month: 'May', revenue: 55000, bookings: 520 },
    { month: 'Jun', revenue: 67000, bookings: 640 },
    { month: 'Jul', revenue: 72000, bookings: 680 },
    { month: 'Aug', revenue: 69000, bookings: 650 },
    { month: 'Sep', revenue: 58000, bookings: 540 },
    { month: 'Oct', revenue: 71000, bookings: 670 },
  ];

  const routeData = [
    { name: 'NYC → LAX', value: 28, bookings: 450 },
    { name: 'SFO → MIA', value: 22, bookings: 350 },
    { name: 'CHI → BOS', value: 18, bookings: 290 },
    { name: 'LAX → SEA', value: 16, bookings: 260 },
    { name: 'Others', value: 16, bookings: 250 },
  ];

  const occupancyData = [
    { day: 'Mon', occupancy: 65 },
    { day: 'Tue', occupancy: 72 },
    { day: 'Wed', occupancy: 68 },
    { day: 'Thu', occupancy: 78 },
    { day: 'Fri', occupancy: 85 },
    { day: 'Sat', occupancy: 92 },
    { day: 'Sun', occupancy: 88 },
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => onNavigate('admin-dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl text-gray-900">Analytics & Reports</h1>
              <p className="text-gray-600">Comprehensive business insights</p>
            </div>
          </div>
          <Select defaultValue="30">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 days</SelectItem>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="bg-white border-0 shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Total Revenue</p>
                <Badge className="bg-green-100 text-green-700 border-0 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +12.5%
                </Badge>
              </div>
              <p className="text-3xl text-gray-900">$628,000</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <Card className="bg-white border-0 shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Total Bookings</p>
                <Badge className="bg-green-100 text-green-700 border-0 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +8.3%
                </Badge>
              </div>
              <p className="text-3xl text-gray-900">5,900</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white border-0 shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Avg. Fare</p>
                <Badge className="bg-red-100 text-red-700 border-0 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  -2.1%
                </Badge>
              </div>
              <p className="text-3xl text-gray-900">$106</p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <Card className="bg-white border-0 shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Occupancy Rate</p>
                <Badge className="bg-green-100 text-green-700 border-0 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +5.2%
                </Badge>
              </div>
              <p className="text-3xl text-gray-900">78%</p>
            </Card>
          </motion.div>
        </div>

        {/* Revenue Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card className="bg-white border-0 shadow-lg p-6">
            <h2 className="text-xl text-gray-900 mb-6">Revenue & Bookings Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#3b82f6" name="Revenue ($)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="bookings" fill="#8b5cf6" name="Bookings" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Popular Routes */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white border-0 shadow-lg p-6">
              <h2 className="text-xl text-gray-900 mb-6">Popular Routes</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={routeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {routeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>

          {/* Occupancy Rate */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white border-0 shadow-lg p-6">
              <h2 className="text-xl text-gray-900 mb-6">Weekly Occupancy Rate (%)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={occupancyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="occupancy"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </div>

        {/* Route Performance Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-white border-0 shadow-lg p-6">
            <h2 className="text-xl text-gray-900 mb-6">Route Performance</h2>
            <div className="space-y-4">
              {routeData.map((route, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div>
                      <p className="text-gray-900">{route.name}</p>
                      <p className="text-sm text-gray-600">{route.bookings} bookings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg text-gray-900">{route.value}%</p>
                    <p className="text-sm text-gray-600">of total</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
