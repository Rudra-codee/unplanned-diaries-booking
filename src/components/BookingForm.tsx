
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import TripRequestModal from "./TripRequestModal";

const BookingForm = () => {
  const [showModal, setShowModal] = useState(false);

  const handleCheckAvailability = () => {
    setShowModal(true);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Plan Your Perfect <span className="text-emerald-500">Adventure</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tell us your dream destination and we'll create an unforgettable experience just for you.
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mb-8">
              <p className="text-lg text-gray-600 mb-6">
                Ready to embark on your next adventure? Click below to tell us about your dream trip and we'll get back to you with personalized recommendations.
              </p>
              
              <Button 
                onClick={handleCheckAvailability}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-12 py-4 rounded-full text-lg font-semibold flex items-center gap-2 mx-auto"
              >
                <Search className="w-5 h-5" />
                Plan My Trip
              </Button>
            </div>
          </div>
        </div>
      </div>

      <TripRequestModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />
    </section>
  );
};

export default BookingForm;
