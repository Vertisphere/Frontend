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
import { Button } from "@/components/ui/button";
import { CustomerModal } from "@/app/franchiser/orders/CustomerModal";
import { Customer } from "@/types/customer";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useCustomerStore } from "@/store/customerStore";
import { cn } from "@/lib/utils";
import { Pagination } from "@/components/ui/pagination";
import { CustomerService } from "@/services/api/customers";

function StatusChip({ status }: { status: string | boolean | undefined }) {
  const getStatusStyles = (status: string | boolean | undefined) => {
    if (typeof status === "boolean") {
      return status
        ? "bg-green-100 text-green-800"
        : "bg-gray-100 text-gray-800";
    }

    // not sure how many we need
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "paid":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string | boolean | undefined) => {
    if (typeof status === "boolean") {
      return status ? "Active" : "Inactive";
    }
    return status || "Unknown";
  };

  return (
    <span
      className={cn(
        "px-2 py-1 rounded-full text-xs font-medium",
        getStatusStyles(status),
      )}
    >
      {getStatusText(status)}
    </span>
  );
}

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const {
    selectedCustomers,
    setSelectedCustomers,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
  } = useCustomerStore();

  // refresh interval to sync with QB
  // can be removed if needed
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(
    null,
  );

  useEffect(() => {
    fetchCustomers();

    const interval = setInterval(fetchCustomers, 30000);
    setPollingInterval(interval);

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [currentPage, pageSize]);

  const fetchCustomers = async () => {
    try {
      setIsLoading(true);

      try {
        const data = await CustomerService.fetchCustomers(
          pageSize,
          currentPage,
        );
        setCustomers(data.customers);
      } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
          router.push("/franchiser/oauth");
          return;
        }
        throw error;
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomerUpdate = async (updatedCustomer: Customer) => {
    try {
      try {
        await CustomerService.updateCustomer(
          updatedCustomer.Id.toString(),
          updatedCustomer,
        );
        await fetchCustomers();
        setIsModalOpen(false);
      } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
          router.push("/franchiser/oauth");
          return;
        }
        throw error;
      }
    } catch (error) {
      console.error("Error updating customer:", error);
    }
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.DisplayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.Id?.toString().includes(searchQuery) ||
      customer.PrimaryPhone?.FreeFormNumber?.includes(searchQuery) ||
      customer.BillAddr?.Line1?.toLowerCase().includes(
        searchQuery.toLowerCase(),
      ),
  );

  const totalItems = filteredCustomers.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  useEffect(() => {
    setTotalPages(Math.ceil(totalItems / pageSize));
  }, [totalItems, pageSize]);

  const handleCheckboxChange = (customerId: string) => {
    setSelectedCustomers(
      selectedCustomers.includes(customerId)
        ? selectedCustomers.filter((id) => id !== customerId)
        : [...selectedCustomers, customerId],
    );
  };

  // slug franchiser/customers/{custimerId}
  const handleRowClick = (customerId: string) => {
    router.push(`/franchiser/customers/${customerId}`);
  };

  return (
    <div className="w-full max-w-[100vw] overflow-hidden px-2 sm:px-4 md:px-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Customers</h1>

      <div className="mb-4 w-full flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by name, ID, phone, or address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <Button variant="outline" onClick={fetchCustomers} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
        </Button>
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
                        selectedCustomers.includes(customer.Id.toString()),
                      )
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedCustomers(
                          Array.from(
                            new Set([
                              ...selectedCustomers,
                              ...currentCustomers.map((c) => c.Id.toString()),
                            ]),
                          ),
                        );
                      } else {
                        setSelectedCustomers(
                          selectedCustomers.filter(
                            (id) =>
                              !currentCustomers.find(
                                (c) => c.Id.toString() === id,
                              ),
                          ),
                        );
                      }
                    }}
                  />
                </TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    <Loader2 className="h-4 w-4 inline-block mr-2 animate-spin" />
                    Loading...
                  </TableCell>
                </TableRow>
              ) : currentCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                currentCustomers.map((customer) => (
                  <TableRow
                    key={customer.Id}
                    onClick={() => handleRowClick(customer.Id.toString())}
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <TableCell className="w-[50px]">
                      <Checkbox
                        checked={selectedCustomers.includes(
                          customer.Id.toString(),
                        )}
                        onCheckedChange={() =>
                          handleCheckboxChange(customer.Id.toString())
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell>{customer.BillAddr?.Line1 || "N/A"}</TableCell>
                    <TableCell>
                      <StatusChip status={customer.Active} />
                    </TableCell>
                    <TableCell>
                      {customer.MetaData?.LastUpdatedTime
                        ? new Date(
                            customer.MetaData.LastUpdatedTime,
                          ).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>${customer.Balance.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={totalItems}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      <CustomerModal
        customer={selectedCustomer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCustomerUpdate}
      />
    </div>
  );
}
