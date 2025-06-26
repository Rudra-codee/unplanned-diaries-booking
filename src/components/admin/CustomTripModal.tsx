
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CustomTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CustomTripModal = ({ isOpen, onClose, onSuccess }: CustomTripModalProps) => {
  const [formData, setFormData] = useState({
    location: '',
    number_of_guests: 1,
    start_date: '',
    end_date: '',
    contact_number: '',
    contact_email: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('custom_trip_requests')
        .insert([{
          location: formData.location,
          number_of_guests: formData.number_of_guests,
          start_date: formData.start_date,
          end_date: formData.end_date,
          contact_number: formData.contact_number,
          contact_email: formData.contact_email || null,
          status: 'pending'
        }]);

      if (error) throw error;

      toast.success('Trip request created successfully!');
      onSuccess();
      onClose();
      setFormData({
        location: '',
        number_of_guests: 1,
        start_date: '',
        end_date: '',
        contact_number: '',
        contact_email: ''
      });
    } catch (error: any) {
      console.error('Error creating trip request:', error);
      toast.error('Failed to create trip request');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Custom Trip Request</DialogTitle>
          <DialogDescription>
            Create a new custom trip request for planning
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="location">Destination</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder="Enter destination"
              required
            />
          </div>

          <div>
            <Label htmlFor="guests">Number of Guests</Label>
            <Input
              id="guests"
              type="number"
              min="1"
              value={formData.number_of_guests}
              onChange={(e) => handleChange('number_of_guests', parseInt(e.target.value))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="start_date">Start Date</Label>
              <Input
                id="start_date"
                type="date"
                value={formData.start_date}
                onChange={(e) => handleChange('start_date', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="end_date">End Date</Label>
              <Input
                id="end_date"
                type="date"
                value={formData.end_date}
                onChange={(e) => handleChange('end_date', e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="contact_number">Contact Number</Label>
            <Input
              id="contact_number"
              type="tel"
              value={formData.contact_number}
              onChange={(e) => handleChange('contact_number', e.target.value)}
              placeholder="Enter contact number"
              required
            />
          </div>

          <div>
            <Label htmlFor="contact_email">Email (Optional)</Label>
            <Input
              id="contact_email"
              type="email"
              value={formData.contact_email}
              onChange={(e) => handleChange('contact_email', e.target.value)}
              placeholder="Enter email address"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CustomTripModal;
