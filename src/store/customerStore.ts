import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CustomerStore {
  selectedCustomers: string[];
  setSelectedCustomers: (customers: string[]) => void;
  addSelectedCustomer: (customerId: string) => void;
  removeSelectedCustomer: (customerId: string) => void;
  clearSelectedCustomers: () => void;
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
}

export const useCustomerStore = create<CustomerStore>()(
  persist(
    (set) => ({
      selectedCustomers: [],
      setSelectedCustomers: (customers) =>
        set({ selectedCustomers: customers }),
      addSelectedCustomer: (customerId) =>
        set((state) => ({
          selectedCustomers: [...state.selectedCustomers, customerId],
        })),
      removeSelectedCustomer: (customerId) =>
        set((state) => ({
          selectedCustomers: state.selectedCustomers.filter(
            (id) => id !== customerId,
          ),
        })),
      clearSelectedCustomers: () => set({ selectedCustomers: [] }),
      currentPage: 1,
      pageSize: 10,
      setCurrentPage: (page) => set({ currentPage: page }),
      setPageSize: (size) => set({ pageSize: size }),
    }),
    {
      name: "customer-storage",
    },
  ),
);
