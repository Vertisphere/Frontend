"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface InvoiceDetail {
  Id: string;
  DocNumber: string;
  TxnDate: string;
  TotalAmt: number;
  Balance: number;
  Line: Array<{
    Id: string;
    Description: string;
    Amount: number;
    SalesItemLineDetail?: {
      Qty: number;
      UnitPrice: number;
    };
  }>;
}

export default function InvoiceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<InvoiceDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInvoiceDetail = async () => {
      try {
        setIsLoading(true);
        const idToken = sessionStorage.getItem("jwt");

        if (!idToken) {
          router.push("/franchiser/oauth");
          return;
        }

        const response = await fetch(
          `https://api.ordrport.com/qbInvoice/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch invoice details");
        }

        const data = await response.json();
        setInvoice(data.invoice);
      } catch (error) {
        console.error("Error fetching invoice details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoiceDetail();
  }, [params.id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!invoice) {
    return <div>Invoice not found</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoice #{invoice.DocNumber}</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Back to Orders
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="p-4 border rounded">
          <h3 className="font-semibold text-gray-600">Invoice Number</h3>
          <p>{invoice.DocNumber}</p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="font-semibold text-gray-600">Date</h3>
          <p>{new Date(invoice.TxnDate).toLocaleDateString()}</p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="font-semibold text-gray-600">Total Amount</h3>
          <p>${invoice.TotalAmt.toFixed(2)}</p>
        </div>
        <div className="p-4 border rounded">
          <h3 className="font-semibold text-gray-600">Balance</h3>
          <p>${invoice.Balance.toFixed(2)}</p>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Unit Price</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.Line.filter((line) => line.Description).map((line) => (
              <TableRow key={line.Id}>
                <TableCell>{line.Description}</TableCell>
                <TableCell className="text-right">
                  {line.SalesItemLineDetail?.Qty || "-"}
                </TableCell>
                <TableCell className="text-right">
                  ${line.SalesItemLineDetail?.UnitPrice.toFixed(2) || "-"}
                </TableCell>
                <TableCell className="text-right">
                  ${line.Amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
