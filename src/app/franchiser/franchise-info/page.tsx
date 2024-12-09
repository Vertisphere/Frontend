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
import { Loader2, Search, Pencil, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import { useInventoryStore } from "@/store/inventoryStore";
import { DeleteCustomerModal } from "@/app/franchiser/franchise-info/modals/DeleteCustomerModal";
import { EditCustomerModal } from "@/app/franchiser/franchise-info/modals/EditCustomerModal";

interface Customer {
  Id: string;
  DisplayName: string;
  PrimaryEmailAddr: {
    Address: string;
  };
  BillAddr: {
    City: string;
    CountrySubDivisionCode: string;
  };
  MetaData: {
    CreateTime: string;
  };
}

export default function InventoryPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

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

      const response = await fetch(`https://api.ordrport.com/qbCustomers`, {
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
      setCustomers(data.customers);
    } catch (error) {
      console.error("Error fetching inventory items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.DisplayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.BillAddr?.City?.toLowerCase().includes(
        searchQuery.toLowerCase(),
      ),
  );

  const totalCustomers = filteredCustomers.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    resetPagination();
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      currentCustomers.forEach((item) => toggleSelectedRow(item.Id));
    } else {
      clearSelectedRows();
    }
  };

  const handleDelete = async () => {
    if (!selectedCustomer) return;

    try {
      const idToken = sessionStorage.getItem("jwt");
      const response = await fetch(
        `https://api.ordrport.com/qbCustomers/${selectedCustomer.Id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
            "Sync-QuickBooks": "true",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "DELETE",
            "Access-Control-Allow-Headers":
              "Content-Type, Authorization, Sync-QuickBooks",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchItems();
    } catch (error) {
      console.error("Error deleting customer:", error);
    }

    setDeleteModalOpen(false);
  };

  const handleEdit = async (formData: any) => {
    if (!selectedCustomer) return;

    try {
      const idToken = sessionStorage.getItem("jwt");
      const response = await fetch(
        `https://api.ordrport.com/qbCustomers/${selectedCustomer.Id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
            "Sync-QuickBooks": "true",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "PUT",
            "Access-Control-Allow-Headers":
              "Content-Type, Authorization, Sync-QuickBooks",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchItems();
    } catch (error) {
      console.error("Error updating customer:", error);
    }

    setEditModalOpen(false);
  };

  return (
    <div className="flex justify-center w-full">
      <div className="w-full max-w-7xl overflow-hidden px-2 sm:px-4 md:px-6">
        <h1 className="text-xl sm:text-2xl font-bold mb-4">Inventory</h1>

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

        <div className="w-full overflow-x-auto border rounded-md">
          <div className="min-w-[800px]">
            <Table className="border-collapse border-slate-700">
              <TableHeader className="bg-slate-200">
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={
                        currentCustomers.length > 0 &&
                        currentCustomers.every((customer) =>
                          isRowSelected(customer.Id),
                        )
                      }
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Actions</TableHead>
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
                ) : currentCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No items found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentCustomers.map((customer) => (
                    <TableRow
                      key={customer.Id}
                      className="cursor-pointer hover:bg-gray-100"
                      onClick={() =>
                        router.push(`/franchiser/franchise-info/${customer.Id}`)
                      }
                    >
                      <TableCell className="w-[50px]">
                        <Checkbox
                          checked={isRowSelected(customer.Id)}
                          onCheckedChange={() => toggleSelectedRow(customer.Id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                      <TableCell>{customer.DisplayName}</TableCell>
                      <TableCell>{`${customer.BillAddr?.City}, ${customer.BillAddr?.CountrySubDivisionCode}`}</TableCell>
                      <TableCell>
                        {new Date(
                          customer.MetaData.CreateTime,
                        ).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {customer.PrimaryEmailAddr?.Address}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCustomer(customer);
                              setEditModalOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCustomer(customer);
                              setDeleteModalOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
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
              {startIndex + 1}-{Math.min(endIndex, totalCustomers)} of{" "}
              {totalCustomers}
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
                { length: Math.ceil(totalCustomers / pageSize) },
                (_, i) => i + 1,
              )
                .filter((page) => {
                  const distance = Math.abs(page - currentPage);
                  return (
                    distance === 0 ||
                    distance === 1 ||
                    page === 1 ||
                    page === Math.ceil(totalCustomers / pageSize)
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
              Page {currentPage} of {Math.ceil(totalCustomers / pageSize)}
            </span>

            <Button
              onClick={() =>
                setCurrentPage(
                  Math.min(
                    Math.ceil(totalCustomers / pageSize),
                    currentPage + 1,
                  ),
                )
              }
              disabled={currentPage === Math.ceil(totalCustomers / pageSize)}
              variant="outline"
              size="sm"
              className="text-sm whitespace-nowrap"
            >
              Next
            </Button>
          </div>
        </div>

        {selectedCustomer && (
          <>
            <DeleteCustomerModal
              isOpen={deleteModalOpen}
              onClose={() => setDeleteModalOpen(false)}
              onConfirm={handleDelete}
              customerName={selectedCustomer.DisplayName}
            />
            <EditCustomerModal
              isOpen={editModalOpen}
              onClose={() => setEditModalOpen(false)}
              onSave={handleEdit}
              customer={selectedCustomer}
            />
          </>
        )}
      </div>
    </div>
  );
}
