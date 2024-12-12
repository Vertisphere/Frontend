"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function OAuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    async function authenticate(idToken: string) {
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
          "Authenticating with token:",
          idToken.substring(0, 20) + "...",
        );

        try {
          sessionStorage.setItem("jwt", idToken);
          router.replace("/franchiser/orders");
        } catch (storageError) {
          console.error("Error storing token:", storageError);
        }
      } catch (error) {
        console.error("Error in authenticate:", error);
      }
    }

    const providedIdToken = sessionStorage.getItem("jwt");
    if (providedIdToken) {
      authenticate(providedIdToken);
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
