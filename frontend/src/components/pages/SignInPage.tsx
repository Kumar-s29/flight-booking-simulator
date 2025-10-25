import { useState } from "react";
import { Mail, Lock, Plane, Smartphone, Loader2, UserPlus } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { motion } from "motion/react";
import { login, register } from "../../services/api";
import type { UserRegister } from "../../types/flight";

interface SignInPageProps {
  onNavigate: (page: string, data?: any) => void;
}

export function SignInPage({ onNavigate }: SignInPageProps) {
  // Sign In State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sign Up State
  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    first_name: "",
    last_name: "",
    phone: "",
    date_of_birth: "",
  });

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await login({ email, password });
      console.log("Login successful:", response);
      onNavigate("profile");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.response?.data?.detail || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate passwords match
    if (signUpData.password !== signUpData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate required fields
    if (
      !signUpData.email ||
      !signUpData.password ||
      !signUpData.first_name ||
      !signUpData.last_name
    ) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      const userData: UserRegister = {
        email: signUpData.email,
        password: signUpData.password,
        first_name: signUpData.first_name,
        last_name: signUpData.last_name,
        phone: signUpData.phone || undefined,
        date_of_birth: signUpData.date_of_birth || undefined,
      };

      const response = await register(userData);
      console.log("Registration successful:", response);
      onNavigate("profile");
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.detail || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-500 to-purple-600 pt-20 pb-12 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-white hidden lg:block"
          >
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <Plane className="w-10 h-10 text-white" />
                </div>
                <span className="text-4xl">SkyWings</span>
              </div>
              <h1 className="text-5xl mb-4 leading-tight">
                Your Journey <br />
                Starts Here
              </h1>
              <p className="text-xl text-blue-100">
                Book flights to 500+ destinations worldwide with the best prices
                guaranteed
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  ✓
                </div>
                <span className="text-lg">Best price guarantee</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  ✓
                </div>
                <span className="text-lg">24/7 customer support</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  ✓
                </div>
                <span className="text-lg">Instant booking confirmation</span>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Sign In Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="backdrop-blur-xl bg-white/95 border-0 shadow-2xl p-8">
              <div className="text-center mb-6">
                <h2 className="text-3xl text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-600">Sign in to manage your bookings</p>
              </div>

              <Tabs defaultValue="email" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="email">Sign In</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="email">
                  <form onSubmit={handleEmailSignIn}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative mt-2">
                          <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 h-12"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="password">Password</Label>
                        <div className="relative mt-2">
                          <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="pl-10 h-12"
                            required
                          />
                        </div>
                      </div>

                      {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-red-800 text-sm">{error}</p>
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Signing In...
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <form onSubmit={handleSignUp}>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="signup-firstname">First Name</Label>
                          <Input
                            id="signup-firstname"
                            type="text"
                            placeholder="John"
                            value={signUpData.first_name}
                            onChange={(e) =>
                              setSignUpData({
                                ...signUpData,
                                first_name: e.target.value,
                              })
                            }
                            className="mt-2 h-12"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="signup-lastname">Last Name</Label>
                          <Input
                            id="signup-lastname"
                            type="text"
                            placeholder="Doe"
                            value={signUpData.last_name}
                            onChange={(e) =>
                              setSignUpData({
                                ...signUpData,
                                last_name: e.target.value,
                              })
                            }
                            className="mt-2 h-12"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="signup-email">Email Address</Label>
                        <div className="relative mt-2">
                          <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <Input
                            id="signup-email"
                            type="email"
                            placeholder="john@example.com"
                            value={signUpData.email}
                            onChange={(e) =>
                              setSignUpData({
                                ...signUpData,
                                email: e.target.value,
                              })
                            }
                            className="pl-10 h-12"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="signup-phone">
                          Phone Number (Optional)
                        </Label>
                        <div className="relative mt-2">
                          <Smartphone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <Input
                            id="signup-phone"
                            type="tel"
                            placeholder="+1 234 567 8900"
                            value={signUpData.phone}
                            onChange={(e) =>
                              setSignUpData({
                                ...signUpData,
                                phone: e.target.value,
                              })
                            }
                            className="pl-10 h-12"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="signup-dob">
                          Date of Birth (Optional)
                        </Label>
                        <Input
                          id="signup-dob"
                          type="date"
                          value={signUpData.date_of_birth}
                          onChange={(e) =>
                            setSignUpData({
                              ...signUpData,
                              date_of_birth: e.target.value,
                            })
                          }
                          className="mt-2 h-12"
                        />
                      </div>

                      <div>
                        <Label htmlFor="signup-password">Password</Label>
                        <div className="relative mt-2">
                          <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <Input
                            id="signup-password"
                            type="password"
                            placeholder="••••••••"
                            value={signUpData.password}
                            onChange={(e) =>
                              setSignUpData({
                                ...signUpData,
                                password: e.target.value,
                              })
                            }
                            className="pl-10 h-12"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="signup-confirmpassword">
                          Confirm Password
                        </Label>
                        <div className="relative mt-2">
                          <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                          <Input
                            id="signup-confirmpassword"
                            type="password"
                            placeholder="••••••••"
                            value={signUpData.confirmPassword}
                            onChange={(e) =>
                              setSignUpData({
                                ...signUpData,
                                confirmPassword: e.target.value,
                              })
                            }
                            className="pl-10 h-12"
                            required
                          />
                        </div>
                      </div>

                      {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                          <p className="text-red-800 text-sm">{error}</p>
                        </div>
                      )}

                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-5 h-5 mr-2" />
                            Sign Up
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
