"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Customer } from "@/types/customer";

interface CustomerModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (customer: Customer) => void;
}

export function CustomerModal({
  customer,
  isOpen,
  onClose,
  onSubmit,
}: CustomerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {customer ? "Edit Customer" : "Add Customer"}
          </DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
