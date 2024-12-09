import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedItem: any) => void;
  item: {
    Id: string;
    Name: string;
    UnitPrice: number;
    PurchaseCost: number;
    QtyOnHand: number;
    Active: boolean;
  } | null;
}

// would work if we had the idToken

export function EditItemModal({
  isOpen,
  onClose,
  onSave,
  item,
}: EditItemModalProps) {
  const [formData, setFormData] = useState(
    item || {
      Name: "",
      UnitPrice: 0,
      PurchaseCost: 0,
      QtyOnHand: 0,
      Active: true,
    },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input
                id="name"
                value={formData.Name}
                onChange={(e) =>
                  setFormData({ ...formData, Name: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="unitPrice" className="text-right">
                Unit Price
              </label>
              <Input
                id="unitPrice"
                type="number"
                value={formData.UnitPrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    UnitPrice: parseFloat(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="purchaseCost" className="text-right">
                Purchase Cost
              </label>
              <Input
                id="purchaseCost"
                type="number"
                value={formData.PurchaseCost}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    PurchaseCost: parseFloat(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="qtyOnHand" className="text-right">
                Quantity
              </label>
              <Input
                id="qtyOnHand"
                type="number"
                value={formData.QtyOnHand}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    QtyOnHand: parseInt(e.target.value),
                  })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="active" className="text-right">
                Active
              </label>
              <div className="col-span-3">
                <Checkbox
                  id="active"
                  checked={formData.Active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, Active: !!checked })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
