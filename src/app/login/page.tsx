"use client";

import { useCallback } from "react";

const INTUIT_CONFIG = {
  clientId: "ABRZXEqL4DpCxHz4OhdiuKg0BXaKIYf4QfVgqLdzC3SngxVNWy",
  redirectUri: "http://localhost:3000/franchiser/oauth",
  environment: "sandbox",
  scope: "com.intuit.quickbooks.accounting openid profile email phone",
  responseType: "code",
} as const;

export default function Login() {
  const loginWithQuickbooks = useCallback(() => {
    const state = crypto.randomUUID();
    sessionStorage.setItem("qb_state", state);

    const params = new URLSearchParams({
      client_id: INTUIT_CONFIG.clientId,
      redirect_uri: INTUIT_CONFIG.redirectUri,
      response_type: INTUIT_CONFIG.responseType,
      scope: INTUIT_CONFIG.scope,
      state: state,
    });

    window.location.href = `https://appcenter.intuit.com/connect/oauth2/authorize?${params.toString()}`;
  }, []);

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
          <button
            onClick={loginWithQuickbooks}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium
              hover:bg-blue-700 transform transition duration-200 hover:shadow-lg"
          >
            Connect to QuickBooks
          </button>

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
              className="w-full block text-center py-3 px-4 bg-green-600 text-white rounded-lg font-medium
                hover:bg-green-700 transform transition duration-200 hover:shadow-lg"
            >
              Create QuickBooks Account
            </a>
          </div>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p className="text-center">
            By connecting your account, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
