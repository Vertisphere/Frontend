"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";
import { auth, db } from "@/config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

const TEST_CREDENTIALS = {
  email: "test@franchisee.com",
  password: "test123",
};

const FranchiseeLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      let userCredential;
      if (isLogin) {
        try {
          userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password,
          );
        } catch (loginError: any) {
          if (
            email === TEST_CREDENTIALS.email &&
            password === TEST_CREDENTIALS.password
          ) {
            try {
              userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password,
              );
              await setDoc(doc(db, "franchisees", userCredential.user.uid), {
                email,
                createdAt: new Date(),
                role: "franchisee",
              });
            } catch (createError) {
              console.error("Error creating test account:", createError);
              return;
            }
          } else {
            handleAuthError(loginError);
            return;
          }
        }
      } else {
        if (password.length < 6) {
          setError("Password must be at least 6 characters");
          return;
        }

        const methods = await fetchSignInMethodsForEmail(auth, email);
        if (methods.length > 0) {
          setError("An account with this email already exists");
          return;
        }

        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password,
        );
        await setDoc(doc(db, "franchisees", userCredential.user.uid), {
          email,
          createdAt: new Date(),
          role: "franchisee",
        });
      }

      await fetchAndStoreIdToken();
      router.push("/franchisee/orders");
    } catch (err: any) {
      console.error("Auth error:", err);
      setError(err.message);
    }
  };

  const handleAuthError = (error: any) => {
    switch (error.code) {
      case "auth/user-not-found":
        setError("No account found with this email");
        break;
      case "auth/wrong-password":
        setError("Incorrect password");
        break;
      case "auth/invalid-email":
        setError("Invalid email address");
        break;
      case "auth/user-disabled":
        setError("This account has been disabled");
        break;
      default:
        setError("Failed to sign in. Please try again.");
    }
  };

  // what is happening here?
  // items can not be fetched from qb without idtoken or jwt
  // currently it uses https://api.ordrport.com/franchiser/qbLogin to get the jwt and stores in the ss to fetch the data
  const fetchAndStoreIdToken = async () => {
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
          router.push("/franchisee/orders");
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
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full shadow border rounded-lg border-gray-200 p-8 space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-medium text-gray-900">
            {isLogin ? "Franchisee Login" : "Franchisee Signup"}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <Input
                type="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : isLogin ? (
                "Sign in"
              ) : (
                "Sign up"
              )}
            </Button>
          </div>
        </form>

        <div className="text-center">
          <Button
            variant="link"
            className="text-indigo-600 hover:text-indigo-500"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Need an account? Sign up"
              : "Already have an account? Sign in"}
          </Button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>Test Credentials:</p>
          <p>Email: {TEST_CREDENTIALS.email}</p>
          <p>Password: {TEST_CREDENTIALS.password}</p>
        </div>
      </div>
    </div>
  );
};

export default FranchiseeLogin;
