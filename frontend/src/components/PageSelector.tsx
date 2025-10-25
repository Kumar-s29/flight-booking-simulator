import { ChevronDown, Layers } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from "./ui/dropdown-menu";

interface PageSelectorProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function PageSelector({ currentPage, onNavigate }: PageSelectorProps) {
  const pages = [
    { group: "Essential Pages", items: [
      { id: "home", label: "🏠 Landing / Home" },
      { id: "search-results", label: "🔍 Flight Search Results" },
      { id: "flight-details", label: "✈️ Flight Details" },
      { id: "checkout", label: "💳 Checkout / Payment" },
      { id: "confirmation", label: "✅ Booking Confirmation" },
      { id: "my-bookings", label: "📋 My Bookings" },
      { id: "manage-booking", label: "⚙️ Manage Booking" },
    ]},
    { group: "User Account", items: [
      { id: "sign-in", label: "🔐 Sign In / Sign Up" },
      { id: "profile", label: "👤 Profile / Account" },
      { id: "booking-history", label: "📅 Booking History" },
    ]},
    { group: "Extras & Services", items: [
      { id: "seat-selection", label: "💺 Seat Selection" },
      { id: "add-ons", label: "🛍️ Add-ons / Extras" },
    ]},
    { group: "Support & Admin", items: [
      { id: "support", label: "💬 Help / Support" },
      { id: "admin-dashboard", label: "📊 Admin Dashboard" },
      { id: "analytics", label: "📈 Analytics / Reports" },
    ]},
  ];

  const getPageLabel = (pageId: string) => {
    for (const group of pages) {
      const item = group.items.find(i => i.id === pageId);
      if (item) return item.label;
    }
    return "Select Page";
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-xl h-12 px-6">
            <Layers className="w-4 h-4 mr-2" />
            {getPageLabel(currentPage)}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64 max-h-[500px] overflow-y-auto">
          {pages.map((group, idx) => (
            <div key={group.group}>
              {idx > 0 && <DropdownMenuSeparator />}
              <DropdownMenuLabel>{group.group}</DropdownMenuLabel>
              {group.items.map((item) => (
                <DropdownMenuItem
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={currentPage === item.id ? "bg-blue-50" : ""}
                >
                  {item.label}
                </DropdownMenuItem>
              ))}
            </div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
