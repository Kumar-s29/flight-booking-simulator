import { Mail, Phone, CreditCard, Save, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import {
  getCurrentUser,
  logout,
  updateProfile,
  isAuthenticated,
} from "../../services/api";
import type { User as UserType, UserUpdate } from "../../types/flight";

interface ProfilePageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    date_of_birth: "",
  });

  useEffect(() => {
    // Check if user is logged in
    if (!isAuthenticated()) {
      onNavigate("sign-in");
      return;
    }

    // Load user data
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setFormData({
        first_name: currentUser.first_name || "",
        last_name: currentUser.last_name || "",
        phone: currentUser.phone || "",
        date_of_birth: currentUser.date_of_birth || "",
      });
    }
  }, [onNavigate]);

  const handleLogout = () => {
    logout();
    onNavigate("home");
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const updateData: UserUpdate = {};
      if (formData.first_name) updateData.first_name = formData.first_name;
      if (formData.last_name) updateData.last_name = formData.last_name;
      if (formData.phone) updateData.phone = formData.phone;
      if (formData.date_of_birth)
        updateData.date_of_birth = formData.date_of_birth;

      const updatedUser = await updateProfile(updateData);
      setUser(updatedUser);
      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-12 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const initials =
    `${user.first_name?.[0] || ""}${user.last_name?.[0] || ""}`.toUpperCase() ||
    "U";

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-12">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl text-gray-900 mb-2">My Profile</h1>
            <p className="text-gray-600">
              Manage your account settings and preferences
            </p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </motion.div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="bg-white border shadow-sm">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="passengers">Saved Passengers</TabsTrigger>
            <TabsTrigger value="payment">Payment Methods</TabsTrigger>
          </TabsList>

          <TabsContent value="personal">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-white border-0 shadow-lg p-8">
                <div className="flex items-center gap-6 mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white text-4xl">
                    {initials}
                  </div>
                  <div>
                    <h2 className="text-2xl text-gray-900">
                      {user.first_name} {user.last_name}
                    </h2>
                    <p className="text-gray-600">{user.email}</p>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}

                {success && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-green-800 text-sm">{success}</p>
                  </div>
                )}

                <form onSubmit={handleSaveChanges} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={formData.first_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            first_name: e.target.value,
                          })
                        }
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={formData.last_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            last_name: e.target.value,
                          })
                        }
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative mt-2">
                      <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={user.email}
                        disabled
                        className="pl-10 bg-gray-50"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Email cannot be changed
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative mt-2">
                      <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    <div className="relative mt-2">
                      <Input
                        id="dob"
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            date_of_birth: e.target.value,
                          })
                        }
                        className="pl-3"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? "Saving..." : "Save Changes"}
                  </Button>
                </form>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="passengers">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card className="bg-white border-0 shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg text-gray-900">Saved Passengers</h3>
                    <p className="text-sm text-gray-600">Coming soon...</p>
                  </div>
                </div>
              </Card>

              <Button className="w-full border-2 border-dashed border-gray-300 bg-transparent text-gray-600 hover:bg-gray-50 h-16">
                + Add New Passenger
              </Button>
            </motion.div>
          </TabsContent>

          <TabsContent value="payment">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Card className="bg-gradient-to-br from-blue-600 to-blue-500 border-0 shadow-lg p-6 text-white">
                <div className="flex items-center justify-between mb-8">
                  <CreditCard className="w-10 h-10" />
                  <span className="text-sm">Payment Methods</span>
                </div>
                <p className="text-lg">Coming soon...</p>
              </Card>

              <Button className="w-full border-2 border-dashed border-gray-300 bg-transparent text-gray-600 hover:bg-gray-50 h-16">
                + Add New Payment Method
              </Button>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
