"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function Login() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loginWithQuickbooks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://api.ordrport.com/franchiser/qbLogin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            AUTH_CODE: process.env.NEXT_PUBLIC_AUTH_CODE,
            REALM_ID: process.env.NEXT_PUBLIC_REALM_ID,
            use_cached_bearer: true,
          }),
        },
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          sessionStorage.setItem("jwt", data.token);
          router.push("/franchiser/orders");
        } else {
          console.error("Authentication failed:", data);
        }
      } else {
        const errorData = await response.text();
        console.error("Failed to authenticate with QuickBooks:", errorData);
      }
    } catch (error) {
      console.error("Error during authentication:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            QuickBooks Connection
          </h1>
          <p className="text-gray-600 mb-4">
            Connect your QuickBooks account to get started
          </p>
        </div>

        <div className="space-y-6">
          <Button
            onClick={loginWithQuickbooks}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium
              hover:bg-blue-700 transform transition duration-200 hover:shadow-lg flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Connect to QuickBooks"
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Don't have an account?
              </span>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              New to QuickBooks?
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Create a QuickBooks Online account to manage your business
              finances and connect with our platform.
            </p>
            <a
              href="https://quickbooks.intuit.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full block text-center py-2 px-4 bg-green-600 text-white rounded-lg font-medium
                hover:bg-green-700 transform transition duration-200 hover:shadow-lg"
            >
              Create QuickBooks Account
            </a>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p className="text-center">
            By connecting your account, you agree to our{" "}
            <a href="/privacy-policy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>{" "}
            and{" "}
            <a href="/eula" className="text-blue-600 hover:underline">
              End User License Agreement
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
