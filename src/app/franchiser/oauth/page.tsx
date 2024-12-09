"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function fetchCustomers(idToken: string) {
      try {
        const tokenParts = idToken.split(".");
        if (tokenParts.length === 3) {
          const payload = JSON.parse(atob(tokenParts[1]));
          console.log("Token expiration:", new Date(payload.exp * 1000));
          console.log("Current time:", new Date());
          if (payload.exp * 1000 < Date.now()) {
            console.log("Token is expired!");
          }
        }

        console.log(
          "Fetching customers with token:",
          idToken.substring(0, 20) + "...",
        );

        const customersResponse = await fetch(
          "https://api.ordrport.com/franchiser/qbCustomers",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${idToken}`,
              "Content-Type": "application/json",
            },
          },
        );

        console.log("Response status:", customersResponse.status);
        console.log(
          "Response headers:",
          Object.fromEntries(customersResponse.headers.entries()),
        );

        if (!customersResponse.ok) {
          const errorText = await customersResponse.text();
          throw new Error(`Failed to fetch customers: ${errorText}`);
        }

        if (customersResponse.status === 200) {
          const responseText = await customersResponse.text();
          if (!responseText) {
            console.log("Empty response received, proceeding with navigation");
            try {
              sessionStorage.setItem("jwt", idToken);
              router.replace("/franchiser/orders");
            } catch (storageError) {
              console.error("Error storing token:", storageError);
            }
            return;
          }

          try {
            const customersData = JSON.parse(responseText);
            console.log("Customers data received:", customersData);
          } catch (parseError) {
            console.warn("Could not parse response as JSON:", parseError);
          }

          try {
            sessionStorage.setItem("jwt", idToken);
            // router.replace("/franchiser/orders");
          } catch (storageError) {
            console.error("Error storing token:", storageError);
          }
        }
      } catch (error) {
        console.error("Error in fetchCustomers:", error);
      }
    }

    const providedIdToken = process.env.AUTH_TOKEN;
    if (providedIdToken) {
      fetchCustomers(providedIdToken);
    }
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700">
          Authenticating...
        </h2>
        <p className="text-gray-500 mt-2">
          Please wait while we complete the authentication process.
        </p>
      </div>
    </div>
  );
}
