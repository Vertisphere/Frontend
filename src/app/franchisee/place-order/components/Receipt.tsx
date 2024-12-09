import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";

interface InventoryItem {
  Id: string;
  Name: string;
  Description: string;
  UnitPrice: number;
  PurchaseCost: number;
  QtyOnHand: number;
  Type: string;
  Active: boolean;
}

interface CartItem extends InventoryItem {
  quantity: number;
}

interface ReceiptProps {
  cartItems: CartItem[];
  onUpdateQuantity: (item: CartItem, delta: number) => void;
  onPlaceOrder: () => void;
}

export const Receipt = ({
  cartItems,
  onUpdateQuantity,
  onPlaceOrder,
}: ReceiptProps) => {
  const total = cartItems.reduce(
    (sum, item) => sum + item.UnitPrice * item.quantity,
    0,
  );

  return (
    <div className="w-80 border rounded-md p-4 bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Cart Summary</h2>
      <div className="space-y-3">
        {cartItems.map((item) => (
          <div key={item.Id} className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
              <div>{item.Name}</div>
              <div>${(item.UnitPrice * item.quantity).toFixed(2)}</div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="text-gray-500">
                ${item.UnitPrice.toFixed(2)} each
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateQuantity(item, -1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span>{item.quantity}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onUpdateQuantity(item, 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <Button
        className="w-full mt-4"
        onClick={onPlaceOrder}
        disabled={cartItems.length === 0}
      >
        Place Order
      </Button>
    </div>
  );
};
