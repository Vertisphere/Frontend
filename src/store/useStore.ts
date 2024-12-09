import { create } from "zustand";
import { Customer } from "../types/customer";

interface CustomerState {
  customers: Customer[];
  selectedCustomer: Customer | null;
  selectedCustomers: string[];
  isLoading: boolean;
  setCustomers: (customers: Customer[]) => void;
  setSelectedCustomer: (customer: Customer | null) => void;
  setSelectedCustomers: (
    customers: string[] | ((prev: string[]) => string[]),
  ) => void;
  setIsLoading: (isLoading: boolean) => void;
  fetchCustomers: () => Promise<void>;
}

export const useStore = create<CustomerState>((set, get) => ({
  customers: [],
  selectedCustomer: null,
  selectedCustomers: [],
  isLoading: false,
  setCustomers: (customers) => set({ customers }),
  setSelectedCustomer: (customer) => set({ selectedCustomer: customer }),
  setSelectedCustomers: (customers) =>
    set({
      selectedCustomers:
        typeof customers === "function"
          ? customers(get().selectedCustomers)
          : customers,
    }),
  setIsLoading: (isLoading) => set({ isLoading }),
  fetchCustomers: async () => {
    try {
      set({ isLoading: true });
      const idToken = sessionStorage.getItem("jwt");

      if (!idToken) {
        throw new Error("No authentication token");
      }

      const response = await fetch(
        "https://api.ordrport.com/franchiser/qbCustomers",
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch customers");
      }

      const data = await response.json();
      set({ customers: data });
    } catch (error) {
      console.error("Error fetching customers:", error);
      set({ customers: [] });
      throw error; // Re-throw to allow handling by components
    } finally {
      set({ isLoading: false });
    }
  },
}));
