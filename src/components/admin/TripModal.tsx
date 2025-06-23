
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TripForm } from "./TripForm";
import type { Trip } from "@/hooks/useTrips";

interface TripModalProps {
  trip?: Trip;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export const TripModal = ({ trip, isOpen, onClose, onSubmit, isLoading }: TripModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {trip ? "Edit Trip" : "Create New Trip"}
          </DialogTitle>
        </DialogHeader>
        <TripForm
          trip={trip}
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};
