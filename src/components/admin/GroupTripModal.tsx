
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GroupTripForm } from "./GroupTripForm";
import type { GroupTrip } from "@/hooks/useGroupTrips";

interface GroupTripModalProps {
  groupTrip?: GroupTrip;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  isLoading?: boolean;
}

export const GroupTripModal = ({ groupTrip, isOpen, onClose, onSubmit, isLoading }: GroupTripModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {groupTrip ? "Edit Group Trip" : "Create New Group Trip"}
          </DialogTitle>
        </DialogHeader>
        <GroupTripForm
          groupTrip={groupTrip}
          onSubmit={onSubmit}
          onCancel={onClose}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  );
};
