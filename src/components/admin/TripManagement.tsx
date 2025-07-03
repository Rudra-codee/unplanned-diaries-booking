
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, MapPin, Users, Calendar } from "lucide-react";
import { useTrips } from "@/hooks/useTrips";
import { TripModal } from "./TripModal";
import { toast } from "sonner";
import type { Trip } from "@/hooks/useTrips";

export default function TripManagement() {
  const { trips, loading, createTrip, updateTrip, deleteTrip } = useTrips();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateTrip = () => {
    setEditingTrip(undefined);
    setIsModalOpen(true);
  };

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    setIsModalOpen(true);
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;
    
    try {
      await deleteTrip(tripId);
      toast.success("Trip deleted successfully!");
    } catch (error) {
      console.error("Error deleting trip:", error);
      toast.error("Failed to delete trip");
    }
  };

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (editingTrip) {
        await updateTrip(editingTrip.id, data);
        toast.success("Trip updated successfully!");
      } else {
        await createTrip(data);
        toast.success("Trip created successfully!");
      }
      setIsModalOpen(false);
      setEditingTrip(undefined);
    } catch (error) {
      console.error("Error saving trip:", error);
      toast.error("Failed to save trip");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading trips...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Trip Management</h2>
          <p className="text-muted-foreground">Manage all trips and packages with real-time updates</p>
        </div>
        <Button onClick={handleCreateTrip}>
          <Plus className="h-4 w-4 mr-2" />
          Add Trip
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trips.map((trip) => (
          <Card key={trip.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Badge variant="secondary">
                  {trip.section}
                </Badge>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditTrip(trip)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteTrip(trip.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-lg">{trip.title}</CardTitle>
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {trip.location}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {trip.image_url && (
                <img
                  src={trip.image_url}
                  alt={trip.title}
                  className="w-full h-32 object-cover rounded-md"
                />
              )}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {trip.description}
              </p>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {trip.duration} days
                </div>
                {trip.max_guests && (
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Max {trip.max_guests}
                  </div>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">₹{trip.price}</span>
                <div className="flex gap-1">
                  {trip.tags?.slice(0, 2).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {trips.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">No trips found</p>
            <Button onClick={handleCreateTrip}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Trip
            </Button>
          </CardContent>
        </Card>
      )}

      <TripModal
        trip={editingTrip}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTrip(undefined);
        }}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}
