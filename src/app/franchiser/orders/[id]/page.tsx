"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Customer } from "@/types/customer";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function StatusChip({ status }: { status: boolean }) {
  return (
    <span
      className={cn(
        "px-2 py-1 rounded-full text-xs font-medium",
        status ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800",
      )}
    >
      {status ? "Active" : "Inactive"}
    </span>
  );
}

export default function CustomerDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        setIsLoading(true);
        const idToken = sessionStorage.getItem("jwt");

        if (!idToken) {
          console.error("No authentication token found");
          router.push("/franchiser/oauth");
          return;
        }

        const response = await fetch(
          `https://api.ordrport.com/qbCustomer/${params.id}`,
          {
            headers: {
              Authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          if (response.status === 401) {
            router.push("/franchiser/oauth");
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCustomer(data.customer);
      } catch (error) {
        console.error("Error fetching customer details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <Skeleton className="h-6 sm:h-8 w-[200px] sm:w-[250px]" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[200px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-[200px]" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <Card className="w-full">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Customer not found
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <h1 className="text-2xl sm:text-3xl font-medium text-slate-700 tracking-tight">
        {customer.DisplayName}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] gap-2">
              <span className="font-medium text-muted-foreground">Name:</span>
              <span>
                {customer.GivenName} {customer.FamilyName}
              </span>

              <span className="font-medium text-muted-foreground">
                Company:
              </span>
              <span>{customer.CompanyName}</span>

              <span className="font-medium text-muted-foreground">Email:</span>
              <span>{customer.PrimaryEmailAddr?.Address}</span>

              <span className="font-medium text-muted-foreground">Phone:</span>
              <span>{customer.PrimaryPhone?.FreeFormNumber}</span>

              <span className="font-medium text-muted-foreground">Mobile:</span>
              <span>{customer.Mobile?.FreeFormNumber}</span>

              <span className="font-medium text-muted-foreground">Status:</span>
              <span>
                <StatusChip status={customer.Active ?? false} />
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">
              Billing Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 space-y-3 sm:space-y-4">
            <div className="grid grid-cols-[100px_1fr] sm:grid-cols-[120px_1fr] gap-2">
              <span className="font-medium text-muted-foreground">
                Balance:
              </span>
              <span>${customer.Balance.toFixed(2)}</span>

              <span className="font-medium text-muted-foreground">
                Address:
              </span>
              <span>{customer.BillAddr?.Line1}</span>

              <span className="font-medium text-muted-foreground">City:</span>
              <span>{customer.BillAddr?.City}</span>

              <span className="font-medium text-muted-foreground">State:</span>
              <span>{customer.BillAddr?.CountrySubDivisionCode}</span>

              <span className="font-medium text-muted-foreground">
                Postal Code:
              </span>
              <span>{customer.BillAddr?.PostalCode}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
