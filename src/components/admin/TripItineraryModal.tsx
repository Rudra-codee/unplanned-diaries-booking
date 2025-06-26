
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Calendar, MapPin } from "lucide-react";

interface TripItineraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  requestId: string | null;
}

interface ItineraryDay {
  id?: string;
  day_number: number;
  title: string;
  description: string;
  activities: string[];
}

interface CustomTripRequest {
  id: string;
  location: string;
  number_of_guests: number;
  start_date: string;
  end_date: string;
  contact_number: string;
  contact_email?: string;
}

const TripItineraryModal = ({ isOpen, onClose, requestId }: TripItineraryModalProps) => {
  const [request, setRequest] = useState<CustomTripRequest | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingDay, setEditingDay] = useState<ItineraryDay | null>(null);
  const [showDayForm, setShowDayForm] = useState(false);

  useEffect(() => {
    if (isOpen && requestId) {
      fetchRequestAndItinerary();
    }
  }, [isOpen, requestId]);

  useEffect(() => {
    if (requestId) {
      // Set up realtime subscription for itinerary updates
      const channel = supabase
        .channel(`trip-itinerary-${requestId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'trip_itineraries'
          },
          () => {
            fetchItinerary();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [requestId]);

  const fetchRequestAndItinerary = async () => {
    if (!requestId) return;
    
    setLoading(true);
    try {
      // Fetch request details
      const { data: requestData, error: requestError } = await supabase
        .from('custom_trip_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (requestError) throw requestError;
      setRequest(requestData);

      await fetchItinerary();
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load trip details');
    } finally {
      setLoading(false);
    }
  };

  const fetchItinerary = async () => {
    if (!requestId) return;

    try {
      const { data, error } = await supabase
        .from('trip_itineraries')
        .select('*')
        .eq('trip_id', requestId)
        .order('day_number');

      if (error) throw error;
      
      const formattedItinerary = data?.map(item => ({
        id: item.id,
        day_number: item.day_number,
        title: item.title,
        description: item.description || '',
        activities: Array.isArray(item.activities) ? item.activities : []
      })) || [];

      setItinerary(formattedItinerary);
    } catch (error: any) {
      console.error('Error fetching itinerary:', error);
    }
  };

  const saveDayItinerary = async (dayData: ItineraryDay) => {
    if (!requestId) return;

    try {
      const payload = {
        trip_id: requestId,
        day_number: dayData.day_number,
        title: dayData.title,
        description: dayData.description,
        activities: dayData.activities
      };

      if (dayData.id) {
        // Update existing day
        const { error } = await supabase
          .from('trip_itineraries')
          .update(payload)
          .eq('id', dayData.id);

        if (error) throw error;
      } else {
        // Create new day
        const { error } = await supabase
          .from('trip_itineraries')
          .insert([payload]);

        if (error) throw error;
      }

      toast.success('Itinerary day saved successfully!');
      setShowDayForm(false);
      setEditingDay(null);
    } catch (error: any) {
      console.error('Error saving itinerary day:', error);
      toast.error('Failed to save itinerary day');
    }
  };

  const deleteDayItinerary = async (dayId: string) => {
    try {
      const { error } = await supabase
        .from('trip_itineraries')
        .delete()
        .eq('id', dayId);

      if (error) throw error;
      toast.success('Itinerary day deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting itinerary day:', error);
      toast.error('Failed to delete itinerary day');
    }
  };

  const getTripDuration = () => {
    if (!request) return 0;
    const start = new Date(request.start_date);
    const end = new Date(request.end_date);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  if (!requestId) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Trip Itinerary Planner</DialogTitle>
          <DialogDescription>
            Create detailed day-by-day itinerary for the custom trip request
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        ) : request ? (
          <div className="space-y-6">
            {/* Trip Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  {request.location}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Guests:</span> {request.number_of_guests}
                  </div>
                  <div>
                    <span className="font-medium">Duration:</span> {getTripDuration()} days
                  </div>
                  <div>
                    <span className="font-medium">Start:</span> {new Date(request.start_date).toLocaleDateString()}
                  </div>
                  <div>
                    <span className="font-medium">End:</span> {new Date(request.end_date).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Add New Day Button */}
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Daily Itinerary</h3>
              <Button onClick={() => setShowDayForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Day
              </Button>
            </div>

            {/* Itinerary Days */}
            <div className="space-y-4">
              {itinerary.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No itinerary planned yet. Add some days to get started!
                </div>
              ) : (
                itinerary.map((day) => (
                  <Card key={day.id} className="border-l-4 border-l-orange-400">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center text-lg">
                            <Calendar className="h-4 w-4 mr-2" />
                            Day {day.day_number}: {day.title}
                          </CardTitle>
                          {day.description && (
                            <p className="text-gray-600 mt-1">{day.description}</p>
                          )}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingDay(day);
                              setShowDayForm(true);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => day.id && deleteDayItinerary(day.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    {day.activities.length > 0 && (
                      <CardContent>
                        <div className="space-y-2">
                          <h4 className="font-medium text-sm">Activities:</h4>
                          <div className="flex flex-wrap gap-2">
                            {day.activities.map((activity, index) => (
                              <Badge key={index} variant="secondary">
                                {activity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))
              )}
            </div>

            {/* Day Form Modal */}
            {showDayForm && (
              <DayForm
                day={editingDay}
                onSave={saveDayItinerary}
                onCancel={() => {
                  setShowDayForm(false);
                  setEditingDay(null);
                }}
                existingDays={itinerary.map(d => d.day_number)}
              />
            )}
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

// Day Form Component
interface DayFormProps {
  day: ItineraryDay | null;
  onSave: (day: ItineraryDay) => void;
  onCancel: () => void;
  existingDays: number[];
}

const DayForm = ({ day, onSave, onCancel, existingDays }: DayFormProps) => {
  const [formData, setFormData] = useState<ItineraryDay>({
    day_number: day?.day_number || Math.max(0, ...existingDays) + 1,
    title: day?.title || '',
    description: day?.description || '',
    activities: day?.activities || []
  });
  const [newActivity, setNewActivity] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: day?.id });
  };

  const addActivity = () => {
    if (newActivity.trim()) {
      setFormData(prev => ({
        ...prev,
        activities: [...prev.activities, newActivity.trim()]
      }));
      setNewActivity('');
    }
  };

  const removeActivity = (index: number) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index)
    }));
  };

  return (
    <Card className="border-2 border-orange-200">
      <CardHeader>
        <CardTitle>{day ? 'Edit' : 'Add'} Day Itinerary</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="day_number">Day Number</Label>
              <Input
                id="day_number"
                type="number"
                min="1"
                value={formData.day_number}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  day_number: parseInt(e.target.value)
                }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  title: e.target.value
                }))}
                placeholder="e.g., City Exploration"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                description: e.target.value
              }))}
              placeholder="Brief description of the day"
            />
          </div>

          <div>
            <Label>Activities</Label>
            <div className="flex space-x-2 mb-2">
              <Input
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                placeholder="Add an activity"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addActivity())}
              />
              <Button type="button" onClick={addActivity}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.activities.map((activity, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeActivity(index)}>
                  {activity} ✕
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Save Day
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default TripItineraryModal;
