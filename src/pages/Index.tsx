
import { useState } from "react";
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

const Index = () => {
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingTrip, setBookingTrip] = useState(null);

  const handleTripClick = (trip) => {
    setSelectedTrip(trip);
  };

  const handleBookNow = (trip) => {
    setBookingTrip(trip);
    setSelectedTrip(null);
    setShowBookingModal(true);
  };

  const handleBookingSubmit = (bookingData) => {
    console.log("Booking submitted:", bookingData);
    // Here we would integrate with Razorpay
    alert("Redirecting to payment gateway...");
    setShowBookingModal(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <TrendingDestinations onTripClick={handleTripClick} />
      <UpcomingTrips />
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
