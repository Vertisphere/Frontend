"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Plus, Minus, ShoppingCart } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import { useInventoryStore } from "@/store/inventoryStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Receipt } from "@/app/franchisee/place-order/components/Receipt";

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

export default function InventoryPage() {
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showAlert, setShowAlert] = useState(false);

  const {
    currentPage,
    pageSize,
    searchQuery,
    selectedItems,
    setCurrentPage,
    setPageSize,
    setSearchQuery,
    setSelectedItems,
    resetPagination,
    selectedRows,
    toggleSelectedRow,
    isRowSelected,
    clearSelectedRows,
  } = useInventoryStore();

  useEffect(() => {
    fetchItems();
  }, [currentPage, pageSize]);

  useEffect(() => {
    resetPagination();
  }, [searchQuery]);

  const fetchItems = async () => {
    try {
      setIsLoading(true);
      const idToken = sessionStorage.getItem("jwt");

      if (!idToken) {
        router.push("/franchiser/oauth");
        return;
      }

      const response = await fetch(`https://api.ordrport.com/qbItems`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/franchiser/oauth");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setItems(data.items);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = items.filter(
    (item) =>
      item.Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.Description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.Type?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalItems = filteredItems.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    resetPagination();
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      currentItems.forEach((item) => {
        toggleSelectedRow(item.Id);
        if (!cartItems.find((i) => i.Id === item.Id)) {
          updateItemQuantity(item, 1);
        }
      });
    } else {
      clearSelectedRows();
      setCartItems([]);
    }
  };

  const handleRowSelect = (item: InventoryItem) => {
    toggleSelectedRow(item.Id);
    if (isRowSelected(item.Id)) {
      updateItemQuantity(item, 1);
    } else {
      setCartItems((prev) => prev.filter((i) => i.Id !== item.Id));
    }
  };

  const updateItemQuantity = (item: InventoryItem, delta: number) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.Id === item.Id);
      if (!existing && delta > 0) {
        return [...prev, { ...item, quantity: delta }];
      }
      return prev
        .map((i) => {
          if (i.Id === item.Id) {
            const newQuantity = i.quantity + delta;
            return newQuantity > 0 ? { ...i, quantity: newQuantity } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    setShowAlert(true);
    const total = cartItems.reduce(
      (sum, item) => sum + item.UnitPrice * item.quantity,
      0,
    );
    setCartItems([]);
    clearSelectedRows();
  };

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-7xl overflow-hidden px-2 sm:px-4 md:px-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl sm:text-2xl font-bold">Inventory</h1>
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-6 w-6" />
            <span className="font-semibold">
              {cartItems.reduce((sum, item) => sum + item.quantity, 0)} items
            </span>
          </div>
        </div>

        <div className="mb-4 w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by name, description, or type..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 w-full"
            />
          </div>
        </div>

        <div className="flex gap-6">
          <div className="flex-1">
            <div className="w-full overflow-x-auto border rounded-md">
              <div className="min-w-[800px]">
                <Table className="border-collapse border-slate-700">
                  <TableHeader className="bg-slate-200">
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={
                            currentItems.length > 0 &&
                            currentItems.every((item) => isRowSelected(item.Id))
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Unit Price</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          <Loader2 className="h-4 w-4 inline-block mr-2 animate-spin" />
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : currentItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center">
                          No items found
                        </TableCell>
                      </TableRow>
                    ) : (
                      currentItems.map((item) => (
                        <TableRow key={item.Id} className="hover:bg-gray-100">
                          <TableCell className="w-[50px]">
                            <Checkbox
                              checked={isRowSelected(item.Id)}
                              onCheckedChange={() => handleRowSelect(item)}
                            />
                          </TableCell>
                          <TableCell>{item.Name}</TableCell>
                          <TableCell>{item.Description}</TableCell>
                          <TableCell>{item.Type}</TableCell>
                          <TableCell>{item.QtyOnHand}</TableCell>
                          <TableCell>${item.UnitPrice.toFixed(2)}</TableCell>
                          <TableCell>${item.PurchaseCost.toFixed(2)}</TableCell>
                          <TableCell>
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                item.Active
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {item.Active ? "Active" : "Inactive"}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <Receipt
              cartItems={cartItems}
              onUpdateQuantity={(item, delta) =>
                updateItemQuantity(item, delta)
              }
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
            <span className="text-sm whitespace-nowrap">Rows per page:</span>
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-700 hidden sm:inline whitespace-nowrap">
              {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems}
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
            <Button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              variant="outline"
              size="sm"
              className="text-sm whitespace-nowrap"
            >
              Previous
            </Button>

            <div className="hidden sm:flex items-center gap-1">
              {Array.from(
                { length: Math.ceil(totalItems / pageSize) },
                (_, i) => i + 1,
              )
                .filter((page) => {
                  const distance = Math.abs(page - currentPage);
                  return (
                    distance === 0 ||
                    distance === 1 ||
                    page === 1 ||
                    page === Math.ceil(totalItems / pageSize)
                  );
                })
                .map((page, index, array) => (
                  <React.Fragment key={page}>
                    {index > 0 && array[index - 1] !== page - 1 && (
                      <span className="px-1">...</span>
                    )}
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="text-sm min-w-[32px]"
                    >
                      {page}
                    </Button>
                  </React.Fragment>
                ))}
            </div>

            <span className="sm:hidden text-sm">
              Page {currentPage} of {Math.ceil(totalItems / pageSize)}
            </span>

            <Button
              onClick={() =>
                setCurrentPage(
                  Math.min(Math.ceil(totalItems / pageSize), currentPage + 1),
                )
              }
              disabled={currentPage === Math.ceil(totalItems / pageSize)}
              variant="outline"
              size="sm"
              className="text-sm whitespace-nowrap"
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Order Placed Successfully!</AlertDialogTitle>
            <AlertDialogDescription>
              Your order has been placed successfully.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
