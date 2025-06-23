
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrendingDestinations from "@/components/TrendingDestinations";
import UpcomingTrips from "@/components/UpcomingTrips";
import TourPackages from "@/components/TourPackages";
import BookingForm from "@/components/BookingForm";
import WhyChoose from "@/components/WhyChoose";
import StatsSection from "@/components/StatsSection";
import MissionSection from "@/components/MissionSection";
import MountainTreks from "@/components/MountainTreks";
import Footer from "@/components/Footer";
import TripModal from "@/components/TripModal";
import BookingModal from "@/components/BookingModal";
import { toast } from "sonner";

const Index = () => {
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingTrip, setBookingTrip] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleTripClick = (trip: any) => {
    setSelectedTrip(trip);
  };

  const handleBookNow = (trip: any) => {
    if (!user) {
      toast.error("Please sign in to make a booking");
      navigate("/auth");
      return;
    }
    
    setBookingTrip(trip);
    setSelectedTrip(null);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = (bookingData: any) => {
    console.log("Booking submitted:", bookingData);
    toast.success("Booking created successfully! Redirecting to payment...");
    setShowBookingModal(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <TrendingDestinations onTripClick={handleTripClick} />
      <UpcomingTrips onTripClick={handleTripClick} />
      <TourPackages onTripClick={handleTripClick} />
      <MountainTreks onTripClick={handleTripClick} />
      <BookingForm />
      <WhyChoose />
      <StatsSection />
      <MissionSection />
      <Footer />
      
      {selectedTrip && (
        <TripModal
          trip={selectedTrip}
          onClose={() => setSelectedTrip(null)}
          onBookNow={handleBookNow}
        />
      )}
      
      {showBookingModal && (
        <BookingModal
          trip={bookingTrip}
          onClose={() => setShowBookingModal(false)}
          onSubmit={handleBookingSubmit}
        />
      )}
    </div>
  );
};

export default Index;
