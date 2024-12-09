"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CustomerDetail {
  Id: string;
  DisplayName: string;
  GivenName: string;
  FamilyName: string;
  CompanyName: string;
  PrimaryPhone: {
    FreeFormNumber: string;
  };
  PrimaryEmailAddr: {
    Address: string;
  };
  BillAddr: {
    Line1: string;
    City: string;
    CountrySubDivisionCode: string;
    PostalCode: string;
  };
  Balance: number;
  MetaData: {
    CreateTime: string;
    LastUpdatedTime: string;
  };
}

interface CustomerResponse {
  customer: CustomerDetail;
  is_linked: boolean;
}

export default function CustomerDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomerDetail = async () => {
      try {
        setIsLoading(true);
        const idToken = sessionStorage.getItem("jwt");

        if (!idToken) {
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

        const data: CustomerResponse = await response.json();
        setCustomer(data.customer);
      } catch (error) {
        console.error("Error fetching customer details:", error);
        setError("Failed to load customer details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerDetail();
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error || "Customer not found"}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">
                  Display Name
                </dt>
                <dd className="text-lg">{customer.DisplayName}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                <dd className="text-lg">{`${customer.GivenName} ${customer.FamilyName}`}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Company</dt>
                <dd className="text-lg">{customer.CompanyName || "N/A"}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Balance</dt>
                <dd className="text-lg">${customer.Balance.toFixed(2)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="text-lg">{customer.PrimaryEmailAddr.Address}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Phone</dt>
                <dd className="text-lg">
                  {customer.PrimaryPhone.FreeFormNumber}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Address</dt>
                <dd className="text-lg">
                  {customer.BillAddr.Line1}
                  <br />
                  {`${customer.BillAddr.City}, ${customer.BillAddr.CountrySubDivisionCode} ${customer.BillAddr.PostalCode}`}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
