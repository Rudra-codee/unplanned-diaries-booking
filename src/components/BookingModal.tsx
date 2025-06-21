
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { X, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface BookingModalProps {
  trip: any;
  onClose: () => void;
  onSubmit: (bookingData: any) => void;
}

const BookingModal = ({ trip, onClose, onSubmit }: BookingModalProps) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: user?.email || "",
    guestPhone: "",
    numberOfGuests: 1,
    travelDate: "",
    specialRequests: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "numberOfGuests" ? parseInt(value) || 1 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please sign in to make a booking");
      return;
    }

    setLoading(true);

    try {
      const totalAmount = trip.price * formData.numberOfGuests;
      
      const bookingData = {
        user_id: user.id,
        trip_id: trip.id,
        guest_name: formData.guestName,
        guest_email: formData.guestEmail,
        guest_phone: formData.guestPhone,
        number_of_guests: formData.numberOfGuests,
        travel_date: formData.travelDate,
        total_amount: totalAmount,
        special_requests: formData.specialRequests,
        status: 'pending'
      };

      const { data, error } = await supabase
        .from('bookings')
        .insert([bookingData])
        .select()
        .single();

      if (error) {
        console.error('Booking error:', error);
        toast.error("Failed to create booking. Please try again.");
        return;
      }

      toast.success("Booking created successfully!");
      onSubmit(data);
      onClose();

    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Sign In Required</CardTitle>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              You need to sign in to make a booking.
            </p>
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Book Your Trip</CardTitle>
              <CardDescription>
                Complete your booking for {trip.title}
              </CardDescription>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-lg">{trip.title}</h3>
            <p className="text-gray-600">{trip.location}</p>
            <p className="text-emerald-600 font-bold">${trip.price} per person</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guestName">Full Name *</Label>
                <Input
                  id="guestName"
                  name="guestName"
                  value={formData.guestName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="guestEmail">Email *</Label>
                <Input
                  id="guestEmail"
                  name="guestEmail"
                  type="email"
                  value={formData.guestEmail}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="guestPhone">Phone Number</Label>
                <Input
                  id="guestPhone"
                  name="guestPhone"
                  type="tel"
                  value={formData.guestPhone}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <Label htmlFor="numberOfGuests">Number of Guests *</Label>
                <Input
                  id="numberOfGuests"
                  name="numberOfGuests"
                  type="number"
                  min="1"
                  max={trip.max_guests || 10}
                  value={formData.numberOfGuests}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="travelDate">Travel Date *</Label>
              <Input
                id="travelDate"
                name="travelDate"
                type="date"
                value={formData.travelDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div>
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea
                id="specialRequests"
                name="specialRequests"
                rows={3}
                value={formData.specialRequests}
                onChange={handleInputChange}
                placeholder="Any special requirements or requests..."
              />
            </div>

            <div className="bg-emerald-50 p-4 rounded-lg">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Amount:</span>
                <span className="text-emerald-600">
                  ${(trip.price * formData.numberOfGuests).toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {formData.numberOfGuests} guest{formData.numberOfGuests > 1 ? 's' : ''} × ${trip.price}
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Book Now
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingModal;
