
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, Users, Search } from "lucide-react";

const BookingForm = () => {
  const [formData, setFormData] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: "1"
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Booking form submitted:", formData);
    alert("Searching for available trips...");
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
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <MapPin className="w-4 h-4 mr-2" />
                  Destination
                </label>
                <Select value={formData.destination} onValueChange={(value) => setFormData({...formData, destination: value})}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bali">Bali, Indonesia</SelectItem>
                    <SelectItem value="switzerland">Swiss Alps</SelectItem>
                    <SelectItem value="maldives">Maldives</SelectItem>
                    <SelectItem value="iceland">Iceland</SelectItem>
                    <SelectItem value="kenya">Kenya</SelectItem>
                    <SelectItem value="canada">Canada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <Calendar className="w-4 h-4 mr-2" />
                  Check-in
                </label>
                <Input
                  type="date"
                  value={formData.checkIn}
                  onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <Calendar className="w-4 h-4 mr-2" />
                  Check-out
                </label>
                <Input
                  type="date"
                  value={formData.checkOut}
                  onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <Users className="w-4 h-4 mr-2" />
                  Guests
                </label>
                <Select value={formData.guests} onValueChange={(value) => setFormData({...formData, guests: value})}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Guest</SelectItem>
                    <SelectItem value="2">2 Guests</SelectItem>
                    <SelectItem value="3">3 Guests</SelectItem>
                    <SelectItem value="4">4 Guests</SelectItem>
                    <SelectItem value="5">5+ Guests</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-white px-12 py-4 rounded-full text-lg font-semibold flex items-center gap-2 mx-auto">
                <Search className="w-5 h-5" />
                Check Availability
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
