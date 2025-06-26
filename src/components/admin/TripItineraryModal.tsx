
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ItineraryDay {
  id?: string;
  day_number: number;
  title: string;
  description: string;
  activities: string[];
}

interface TripItineraryModalProps {
  tripId: string;
  isOpen: boolean;
  onClose: () => void;
}

export const TripItineraryModal = ({ tripId, isOpen, onClose }: TripItineraryModalProps) => {
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && tripId) {
      fetchItinerary();
    }
  }, [isOpen, tripId]);

  const fetchItinerary = async () => {
    try {
      const { data, error } = await supabase
        .from('trip_itineraries')
        .select('*')
        .eq('trip_id', tripId)
        .order('day_number');

      if (error) throw error;

      // Convert the data to match our ItineraryDay interface
      const formattedItinerary: ItineraryDay[] = data.map(item => ({
        id: item.id,
        day_number: item.day_number,
        title: item.title,
        description: item.description || '',
        activities: Array.isArray(item.activities) 
          ? item.activities.map(activity => String(activity))
          : []
      }));

      setItinerary(formattedItinerary);
    } catch (error) {
      console.error('Error fetching itinerary:', error);
      toast.error('Failed to load itinerary');
    }
  };

  const addDay = () => {
    const newDay: ItineraryDay = {
      day_number: itinerary.length + 1,
      title: `Day ${itinerary.length + 1}`,
      description: '',
      activities: []
    };
    setItinerary([...itinerary, newDay]);
  };

  const removeDay = (index: number) => {
    const newItinerary = itinerary.filter((_, i) => i !== index);
    // Renumber days
    const renumbered = newItinerary.map((day, i) => ({
      ...day,
      day_number: i + 1,
      title: day.title.includes('Day ') ? `Day ${i + 1}` : day.title
    }));
    setItinerary(renumbered);
  };

  const updateDay = (index: number, field: keyof ItineraryDay, value: any) => {
    const newItinerary = [...itinerary];
    newItinerary[index] = { ...newItinerary[index], [field]: value };
    setItinerary(newItinerary);
  };

  const addActivity = (dayIndex: number) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].activities.push('');
    setItinerary(newItinerary);
  };

  const updateActivity = (dayIndex: number, activityIndex: number, value: string) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].activities[activityIndex] = value;
    setItinerary(newItinerary);
  };

  const removeActivity = (dayIndex: number, activityIndex: number) => {
    const newItinerary = [...itinerary];
    newItinerary[dayIndex].activities.splice(activityIndex, 1);
    setItinerary(newItinerary);
  };

  const saveItinerary = async () => {
    try {
      setLoading(true);

      // Delete existing itinerary
      const { error: deleteError } = await supabase
        .from('trip_itineraries')
        .delete()
        .eq('trip_id', tripId);

      if (deleteError) throw deleteError;

      // Insert new itinerary
      if (itinerary.length > 0) {
        const { error: insertError } = await supabase
          .from('trip_itineraries')
          .insert(
            itinerary.map(day => ({
              trip_id: tripId,
              day_number: day.day_number,
              title: day.title,
              description: day.description,
              activities: day.activities
            }))
          );

        if (insertError) throw insertError;
      }

      toast.success('Itinerary saved successfully');
      onClose();
    } catch (error) {
      console.error('Error saving itinerary:', error);
      toast.error('Failed to save itinerary');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Trip Itinerary</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {itinerary.map((day, dayIndex) => (
            <div key={dayIndex} className="border rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Day {day.day_number}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeDay(dayIndex)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`title-${dayIndex}`}>Title</Label>
                  <Input
                    id={`title-${dayIndex}`}
                    value={day.title}
                    onChange={(e) => updateDay(dayIndex, 'title', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor={`description-${dayIndex}`}>Description</Label>
                <Textarea
                  id={`description-${dayIndex}`}
                  value={day.description}
                  onChange={(e) => updateDay(dayIndex, 'description', e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Activities</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addActivity(dayIndex)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Activity
                  </Button>
                </div>
                
                {day.activities.map((activity, activityIndex) => (
                  <div key={activityIndex} className="flex gap-2 mb-2">
                    <Input
                      value={activity}
                      onChange={(e) => updateActivity(dayIndex, activityIndex, e.target.value)}
                      placeholder="Activity description"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeActivity(dayIndex, activityIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <Button onClick={addDay} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Day
          </Button>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={saveItinerary} disabled={loading}>
              {loading ? 'Saving...' : 'Save Itinerary'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
