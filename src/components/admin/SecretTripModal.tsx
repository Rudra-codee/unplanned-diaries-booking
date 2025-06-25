
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface SecretTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const SecretTripModal: React.FC<SecretTripModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: 'Secret Location Trip',
    description: 'Location unknown, fun guaranteed! Join our exclusive mystery adventure where the destination is a surprise until you arrive.',
    max_guests: 25,
    start_date: '',
    duration_hours: 48
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to create a secret trip');
      return;
    }

    // Calculate end date
    const endDate = new Date();
    endDate.setHours(endDate.getHours() + formData.duration_hours);

    try {
      const { data, error } = await supabase
        .from('secret_trips')
        .insert([{
          title: formData.title,
          description: formData.description,
          max_guests: formData.max_guests,
          available_seats: formData.max_guests,
          start_date: formData.start_date,
          end_date: endDate.toISOString(),
          created_by: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating secret trip:', error);
        toast.error('Failed to create secret trip');
        return;
      }

      toast.success('Secret trip created successfully!');
      onSubmit({ id: data.id });
      onClose();
      
      // Reset form
      setFormData({
        title: 'Secret Location Trip',
        description: 'Location unknown, fun guaranteed! Join our exclusive mystery adventure where the destination is a surprise until you arrive.',
        max_guests: 25,
        start_date: '',
        duration_hours: 48
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while creating the secret trip');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Secret Location Trip</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="max_guests">Maximum Guests</Label>
            <Input
              id="max_guests"
              type="number"
              value={formData.max_guests}
              onChange={(e) => setFormData(prev => ({ ...prev, max_guests: parseInt(e.target.value) }))}
              min="1"
              required
            />
          </div>

          <div>
            <Label htmlFor="start_date">Start Date</Label>
            <Input
              id="start_date"
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="duration_hours">Duration (Hours)</Label>
            <Input
              id="duration_hours"
              type="number"
              value={formData.duration_hours}
              onChange={(e) => setFormData(prev => ({ ...prev, duration_hours: parseInt(e.target.value) }))}
              min="1"
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Creating...' : 'Create Trip'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SecretTripModal;
