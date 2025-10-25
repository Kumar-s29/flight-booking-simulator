import { Plane, Calendar, HelpCircle, User } from "lucide-react";
import { Button } from "./ui/button";
import { getCurrentUser, isAuthenticated } from "../services/api";
import { useEffect, useState } from "react";
import type { User as UserType } from "../types/flight";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    // Check if user is logged in
    if (isAuthenticated()) {
      const currentUser = getCurrentUser();
      setUser(currentUser);
    }
  }, [currentPage]); // Re-check when page changes

  const navItems = [
    { id: "home", label: "Home", icon: Plane },
    { id: "my-bookings", label: "My Bookings", icon: Calendar },
    { id: "support", label: "Support", icon: HelpCircle },
    { id: "admin-dashboard", label: "Admin", icon: User },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => onNavigate("home")}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
              <Plane className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl text-blue-900">SkyWings</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  currentPage === item.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>

          {user ? (
            <Button
              onClick={() => onNavigate("profile")}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
            >
              <User className="w-4 h-4 mr-2" />
              {user.first_name}
            </Button>
          ) : (
            <Button
              onClick={() => onNavigate("sign-in")}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
            >
              <User className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
