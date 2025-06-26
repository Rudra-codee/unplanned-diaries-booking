
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, MapPin, Users, Calendar } from "lucide-react";
import { useGroupTrips, type GroupTrip } from "@/hooks/useGroupTrips";
import { GroupTripModal } from "./GroupTripModal";
import { toast } from "sonner";

export const GroupTripsManagement = () => {
  const { groupTrips, loading, createGroupTrip, updateGroupTrip, deleteGroupTrip } = useGroupTrips();
  const [selectedTrip, setSelectedTrip] = useState<GroupTrip | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = () => {
    setSelectedTrip(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (trip: GroupTrip) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this group trip?")) {
      try {
        await deleteGroupTrip(id);
        toast.success("Group trip deleted successfully");
      } catch (error) {
        toast.error("Failed to delete group trip");
      }
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      if (selectedTrip) {
        await updateGroupTrip(selectedTrip.id, data);
        toast.success("Group trip updated successfully");
      } else {
        await createGroupTrip(data);
        toast.success("Group trip created successfully");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error("Failed to save group trip");
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      educational: "bg-blue-100 text-blue-800",
      corporate: "bg-purple-100 text-purple-800",
      family: "bg-green-100 text-green-800",
      adventure: "bg-orange-100 text-orange-800",
      cultural: "bg-pink-100 text-pink-800",
      wellness: "bg-teal-100 text-teal-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading group trips...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Group Trips Management</h2>
          <p className="text-muted-foreground">Manage educational, corporate, family and other group trips</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Group Trip
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groupTrips.map((trip) => (
          <Card key={trip.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Badge className={getCategoryColor(trip.category)}>
                  {trip.category.charAt(0).toUpperCase() + trip.category.slice(1)}
                </Badge>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(trip)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(trip.id)}
                    className="text-red-600 hover:text-red-700"
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
                  {trip.tags.slice(0, 2).map((tag, index) => (
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

      {groupTrips.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">No group trips found</p>
            <Button onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Group Trip
            </Button>
          </CardContent>
        </Card>
      )}

      <GroupTripModal
        groupTrip={selectedTrip}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};
