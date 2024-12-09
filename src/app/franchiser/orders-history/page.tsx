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
import { Input } from "@/components/ui/input";
import { Loader2, Search, Settings, Pencil, Trash2 } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { EditInvoiceModal } from "@/app/franchiser/orders-history/modals/EditInvoiceModal";
import { DeleteInvoiceModal } from "@/app/franchiser/orders-history/modals/DeleteInvoiceModal";

interface QBInvoice {
  Id: string;
  Location: string;
  Status: string;
  Date: string;
  Amount: number;
}

export default function OrderHistory() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<QBInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedInvoice, setSelectedInvoice] = useState<QBInvoice | null>(
    null,
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<QBInvoice>>({});

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const idToken = sessionStorage.getItem("jwt");

      if (!idToken) {
        router.push("/franchiser/oauth");
        return;
      }

      console.log("Using token:", idToken.substring(0, 20) + "...");

      // can fetch invoices from QB apparently
      // need to check if this is the correct endpoint
      // does not work on postman either

      // mux.Handle("GET /qbInvoices", ListQBInvoices(qbc)) -> gives null
      const response = await fetch(`https://api.ordrport.com/qbInvoices`, {
        // work with id https://api.ordrport.com/qbInvoice/12
        method: "GET",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const responseText = await response.text();
      console.log("Raw response:", responseText);

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/franchiser/oauth");
          return;
        }
        throw new Error(
          `Failed to fetch invoices: ${response.status} ${response.statusText}`,
        );
      }

      if (responseText) {
        const data = JSON.parse(responseText);
        console.log("Parsed data:", data);
        setInvoices(data.invoices);
        setTotalPages(Math.ceil(data.total / pageSize));
      } else {
        console.error("Empty response received from server");
        setInvoices([]);
        setTotalPages(0);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, [currentPage, pageSize]);

  const filteredInvoices = invoices.filter(
    (invoice) =>
      invoice.Location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.Id?.toString().includes(searchQuery),
  );

  const handleRowClick = (invoiceId: string) => {
    router.push(`/franchisee/orders-history/${invoiceId}`);
  };

  const handleEdit = (invoice: QBInvoice, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedInvoice(invoice);
    setEditFormData(invoice);
    setIsEditModalOpen(true);
  };

  const handleDelete = (invoice: QBInvoice, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedInvoice(invoice);
    setIsDeleteModalOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const idToken = sessionStorage.getItem("jwt");
      const response = await fetch(
        `https://api.ordrport.com/qbInvoice/${selectedInvoice?.Id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editFormData),
        },
      );

      if (response.ok) {
        await fetchInvoices();
        setIsEditModalOpen(false);
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      const idToken = sessionStorage.getItem("jwt");
      const response = await fetch(
        `https://api.ordrport.com/qbInvoice/${selectedInvoice?.Id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        },
      );

      if (response.ok) {
        await fetchInvoices();
        setIsDeleteModalOpen(false);
      }
    } catch (error) {
      console.error("Error deleting invoice:", error);
    }
  };

  return (
    <div className="w-full max-w-[100vw] overflow-hidden px-2 sm:px-4 md:px-6">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Order History</h1>

      <div className="mb-4 w-full flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by location or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <Button variant="outline" onClick={fetchInvoices} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
        </Button>
      </div>

      <div className="w-full overflow-x-auto border rounded-lg shadow-sm">
        <div className="min-w-[800px]">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-slate-100">
                <TableHead className="w-12 bg-slate-50 font-medium">
                  <input type="checkbox" className="rounded border-slate-300" />
                </TableHead>
                <TableHead className="bg-slate-50 font-medium">Date</TableHead>
                <TableHead className="bg-slate-50 font-medium">No.</TableHead>
                <TableHead className="bg-slate-50 font-medium">
                  Customer
                </TableHead>
                <TableHead className="bg-slate-50 font-medium">
                  Amount
                </TableHead>
                <TableHead className="bg-slate-50 font-medium">
                  Status
                </TableHead>
                <TableHead className="bg-slate-50 font-medium">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <Loader2 className="h-5 w-5 inline-block mr-2 animate-spin" />
                    Loading...
                  </TableCell>
                </TableRow>
              ) : filteredInvoices.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-8 text-slate-500"
                  >
                    No invoices found
                  </TableCell>
                </TableRow>
              ) : (
                filteredInvoices.map((invoice) => (
                  <TableRow
                    key={invoice.Id}
                    className="cursor-pointer hover:bg-slate-50 transition-colors"
                    onClick={() => handleRowClick(invoice.Id)}
                  >
                    <TableCell className="w-12">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(invoice.Date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{invoice.Id}</TableCell>
                    <TableCell>{invoice.Location}</TableCell>
                    <TableCell className="text-right">
                      ${invoice.Amount.toFixed(2)}
                    </TableCell>
                    <TableCell>{invoice.Status}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleEdit(invoice, e)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={(e) => handleDelete(invoice, e)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
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

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={filteredInvoices.length}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
      />

      <EditInvoiceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        editFormData={editFormData}
        setEditFormData={setEditFormData}
      />

      <DeleteInvoiceModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        invoiceId={selectedInvoice?.Id}
      />
    </div>
  );
}
