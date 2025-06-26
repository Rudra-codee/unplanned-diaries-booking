
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { GroupTrip } from "@/hooks/useGroupTrips";

interface GroupTripFormProps {
  groupTrip?: GroupTrip;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const GroupTripForm = ({ groupTrip, onSubmit, onCancel, isLoading }: GroupTripFormProps) => {
  const [formData, setFormData] = useState({
    title: groupTrip?.title || "",
    category: groupTrip?.category || "educational",
    location: groupTrip?.location || "",
    price: groupTrip?.price || 0,
    description: groupTrip?.description || "",
    image_url: groupTrip?.image_url || "",
    duration: groupTrip?.duration || 1,
    max_guests: groupTrip?.max_guests || null,
    available_from: groupTrip?.available_from || "",
    available_to: groupTrip?.available_to || "",
    tags: groupTrip?.tags?.join(", ") || "",
    features: groupTrip?.features || []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      tags: formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag !== ""),
      features: Array.isArray(formData.features) ? formData.features : []
    };

    await onSubmit(submitData);
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="educational">Educational</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
              <SelectItem value="family">Family</SelectItem>
              <SelectItem value="adventure">Adventure</SelectItem>
              <SelectItem value="cultural">Cultural</SelectItem>
              <SelectItem value="wellness">Wellness</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price *</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => handleChange("price", Number(e.target.value))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (days) *</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) => handleChange("duration", Number(e.target.value))}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="max_guests">Max Guests</Label>
          <Input
            id="max_guests"
            type="number"
            value={formData.max_guests || ""}
            onChange={(e) => handleChange("max_guests", e.target.value ? Number(e.target.value) : null)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="available_from">Available From</Label>
          <Input
            id="available_from"
            type="date"
            value={formData.available_from}
            onChange={(e) => handleChange("available_from", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="available_to">Available To</Label>
          <Input
            id="available_to"
            type="date"
            value={formData.available_to}
            onChange={(e) => handleChange("available_to", e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          id="image_url"
          value={formData.image_url}
          onChange={(e) => handleChange("image_url", e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (comma-separated)</Label>
        <Input
          id="tags"
          value={formData.tags}
          onChange={(e) => handleChange("tags", e.target.value)}
          placeholder="e.g., beach, relaxation, family-friendly"
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : groupTrip ? "Update Group Trip" : "Create Group Trip"}
        </Button>
      </div>
    </form>
  );
};
