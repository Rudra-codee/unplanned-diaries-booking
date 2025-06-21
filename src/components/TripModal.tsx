
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, MapPin, Calendar, Users, Star, Check } from "lucide-react";

const TripModal = ({ trip, onClose, onBookNow }) => {
  if (!trip) return null;

  const itinerary = [
    { day: 1, title: "Arrival & Welcome", description: "Airport pickup and hotel check-in, welcome dinner" },
    { day: 2, title: "City Exploration", description: "Guided city tour, local markets, cultural sites" },
    { day: 3, title: "Adventure Day", description: "Main activity - hiking, water sports, or wildlife safari" },
    { day: 4, title: "Leisure & Culture", description: "Free time, optional cultural experiences" },
    { day: 5, title: "Departure", description: "Hotel checkout and airport drop-off" }
  ];

  const inclusions = [
    "Accommodation in premium hotels",
    "All meals as per itinerary",
    "Professional tour guide",
    "Transportation in AC vehicles",
    "All entry fees and permits",
    "Travel insurance"
  ];

  const exclusions = [
    "International flights",
    "Personal expenses",
    "Tips and gratuities",
    "Optional activities",
    "Visa fees"
  ];

  return (
    <Dialog open={!!trip} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center justify-between">
            {trip.name}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="relative h-64 rounded-lg overflow-hidden">
            <img
              src={trip.image}
              alt={trip.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4" />
                <span>{trip.location}</span>
              </div>
              {trip.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span>{trip.rating}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-500" />
              <span className="font-medium">Duration:</span>
              <span>{trip.duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-500" />
              <span className="font-medium">Group Size:</span>
              <span>Max 12 people</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Price:</span>
              <span className="text-2xl font-bold text-emerald-500">{trip.price}</span>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Trip Description</h3>
            <p className="text-gray-600 leading-relaxed">
              {trip.description || "Experience an unforgettable journey filled with adventure, culture, and breathtaking landscapes. Our expert guides will ensure you have the trip of a lifetime while maintaining the highest safety standards."}
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Day-by-Day Itinerary</h3>
            <div className="space-y-4">
              {itinerary.map((day) => (
                <div key={day.day} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <Badge variant="outline" className="w-12 h-12 rounded-full flex items-center justify-center">
                      {day.day}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">{day.title}</h4>
                    <p className="text-gray-600 text-sm">{day.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold mb-4 text-emerald-600">What's Included</h3>
              <ul className="space-y-2">
                {inclusions.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold mb-4 text-red-600">What's Not Included</h3>
              <ul className="space-y-2">
                {exclusions.map((item, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <X className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="bg-emerald-50 p-6 rounded-lg">
            <h3 className="text-xl font-bold mb-2">Expert Guide</h3>
            <p className="text-gray-600 mb-4">
              Your trip will be led by certified local guides with extensive knowledge of the region's history, culture, and hidden gems.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-200 rounded-full flex items-center justify-center">
                <span className="font-bold text-emerald-700">JD</span>
              </div>
              <div>
                <p className="font-semibold">John Doe</p>
                <p className="text-sm text-gray-600">Certified Guide • 8+ years experience</p>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4 pt-4 border-t">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
              onClick={() => onBookNow(trip)}
            >
              Book Now - {trip.price}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TripModal;
