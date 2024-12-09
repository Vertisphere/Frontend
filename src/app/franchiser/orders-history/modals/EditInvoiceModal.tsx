import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface QBInvoice {
  Id: string;
  Location: string;
  Status: string;
  Date: string;
  Amount: number;
}

interface EditInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => Promise<void>;
  editFormData: Partial<QBInvoice>;
  setEditFormData: (data: Partial<QBInvoice>) => void;
}

export function EditInvoiceModal({
  isOpen,
  onClose,
  onSubmit,
  editFormData,
  setEditFormData,
}: EditInvoiceModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Invoice</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="location">Location</label>
            <Input
              id="location"
              value={editFormData.Location || ""}
              onChange={(e) =>
                setEditFormData({ ...editFormData, Location: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="status">Status</label>
            <Input
              id="status"
              value={editFormData.Status || ""}
              onChange={(e) =>
                setEditFormData({ ...editFormData, Status: e.target.value })
              }
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="amount">Amount</label>
            <Input
              id="amount"
              type="number"
              value={editFormData.Amount || ""}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  Amount: parseFloat(e.target.value),
                })
              }
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSubmit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
