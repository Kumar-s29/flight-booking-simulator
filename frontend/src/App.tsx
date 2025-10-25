import { useState } from "react";
import { Navigation } from "./components/Navigation";
import { PageSelector } from "./components/PageSelector";
import { HomePage } from "./components/pages/HomePage";
import { SearchResultsPage } from "./components/pages/SearchResultsPage";
import { FlightDetailsPage } from "./components/pages/FlightDetailsPage";
import { CheckoutPage } from "./components/pages/CheckoutPage";
import { BookingConfirmationPage } from "./components/pages/BookingConfirmationPage";
import { MyBookingsPage } from "./components/pages/MyBookingsPage";
import { ManageBookingPage } from "./components/pages/ManageBookingPage";
import { SignInPage } from "./components/pages/SignInPage";
import { ProfilePage } from "./components/pages/ProfilePage";
import { SeatSelectionPage } from "./components/pages/SeatSelectionPage";
import { AddOnsPage } from "./components/pages/AddOnsPage";
import { BookingHistoryPage } from "./components/pages/BookingHistoryPage";
import { SavedTripsPage } from "./components/pages/SavedTripsPage";
import { FareRulesPage } from "./components/pages/FareRulesPage";
import { SupportPage } from "./components/pages/SupportPage";
import { AdminDashboardPage } from "./components/pages/AdminDashboardPage";
import { AnalyticsPage } from "./components/pages/AnalyticsPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [pageData, setPageData] = useState<any>(null);

  const handleNavigate = (page: string, data?: any) => {
    setCurrentPage(page);
    setPageData(data);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />;
      case "search-results":
        return (
          <SearchResultsPage
            searchData={pageData}
            onNavigate={handleNavigate}
          />
        );
      case "flight-details":
        return (
          <FlightDetailsPage
            flightData={pageData}
            onNavigate={handleNavigate}
          />
        );
      case "checkout":
        return (
          <CheckoutPage flightData={pageData} onNavigate={handleNavigate} />
        );
      case "confirmation":
        return (
          <BookingConfirmationPage
            bookingData={pageData}
            onNavigate={handleNavigate}
          />
        );
      case "my-bookings":
        return <MyBookingsPage onNavigate={handleNavigate} />;
      case "manage-booking":
        return (
          <ManageBookingPage
            bookingData={pageData}
            onNavigate={handleNavigate}
          />
        );
      case "sign-in":
        return <SignInPage onNavigate={handleNavigate} />;
      case "profile":
        return <ProfilePage onNavigate={handleNavigate} />;
      case "seat-selection":
        return (
          <SeatSelectionPage
            flightData={pageData}
            onNavigate={handleNavigate}
          />
        );
      case "add-ons":
        return <AddOnsPage onNavigate={handleNavigate} />;
      case "booking-history":
        return <BookingHistoryPage onNavigate={handleNavigate} />;
      case "saved-trips":
        return <SavedTripsPage onNavigate={handleNavigate} />;
      case "fare-rules":
        return <FareRulesPage onNavigate={handleNavigate} />;
      case "support":
        return <SupportPage onNavigate={handleNavigate} />;
      case "admin-dashboard":
        return <AdminDashboardPage onNavigate={handleNavigate} />;
      case "analytics":
        return <AnalyticsPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  // Pages that don't need navigation (sign-in has its own design)
  const showNavigation = currentPage !== "sign-in";

  return (
    <div className="min-h-screen bg-white">
      {showNavigation && (
        <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      )}
      {renderPage()}
      <PageSelector currentPage={currentPage} onNavigate={handleNavigate} />
    </div>
  );
}
