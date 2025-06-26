
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Calendar, Users, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TripRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TripRequestModal = ({ isOpen, onClose }: TripRequestModalProps) => {
  const [formData, setFormData] = useState({
    email: "",
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: "1"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.destination || !formData.checkIn || !formData.checkOut) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('queries')
        .insert({
          email: formData.email,
          destination: formData.destination,
          check_in: formData.checkIn,
          check_out: formData.checkOut,
          guests: formData.guests
        });

      if (error) {
        console.error('Error submitting trip request:', error);
        toast.error("Failed to submit trip request. Please try again.");
      } else {
        toast.success("Trip request submitted successfully! We'll get back to you soon.");
        setFormData({
          email: "",
          destination: "",
          checkIn: "",
          checkOut: "",
          guests: "1"
        });
        onClose();
      }
    } catch (error) {
      console.error('Error submitting trip request:', error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Plan Your Perfect Adventure
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium">
                <span className="text-red-500 mr-1">*</span>
                Email Address
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="your@email.com"
                required
                className="h-12"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-gray-700 font-medium">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-red-500 mr-1">*</span>
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-red-500 mr-1">*</span>
                  Check-in
                </label>
                <Input
                  type="date"
                  value={formData.checkIn}
                  onChange={(e) => setFormData({...formData, checkIn: e.target.value})}
                  required
                  className="h-12"
                />
              </div>
              
              <div className="space-y-2">
                <label className="flex items-center text-gray-700 font-medium">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-red-500 mr-1">*</span>
                  Check-out
                </label>
                <Input
                  type="date"
                  value={formData.checkOut}
                  onChange={(e) => setFormData({...formData, checkOut: e.target.value})}
                  required
                  className="h-12"
                />
              </div>
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
          
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-emerald-500 hover:bg-emerald-600"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TripRequestModal;
