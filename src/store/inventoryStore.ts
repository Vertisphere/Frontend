import { create } from "zustand";
import { persist } from "zustand/middleware";

interface InventoryState {
  currentPage: number;
  pageSize: number;
  searchQuery: string;
  selectedItems: string[];
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setSearchQuery: (query: string) => void;
  setSelectedItems: (items: string[]) => void;
  resetPagination: () => void;
  selectedRows: Set<string>;
  toggleSelectedRow: (id: string) => void;
  clearSelectedRows: () => void;
  isRowSelected: (id: string) => boolean;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      currentPage: 1,
      pageSize: 10,
      searchQuery: "",
      selectedItems: [],
      setCurrentPage: (page) => set({ currentPage: page }),
      setPageSize: (size) => set({ pageSize: size }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setSelectedItems: (items) => set({ selectedItems: items }),
      resetPagination: () => set({ currentPage: 1 }),
      selectedRows: new Set(),
      toggleSelectedRow: (id) =>
        set((state) => {
          const newSelected = new Set(state.selectedRows);
          if (newSelected.has(id)) {
            newSelected.delete(id);
          } else {
            newSelected.add(id);
          }
          return { selectedRows: newSelected };
        }),
      clearSelectedRows: () => set({ selectedRows: new Set() }),
      isRowSelected: (id) => get().selectedRows.has(id),
    }),
    {
      name: "inventory-store",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          return {
            state: {
              ...JSON.parse(str || "{}"),
              selectedRows: new Set(JSON.parse(str || "{}").selectedRows || []),
            },
          };
        },
        setItem: (name, value) => {
          localStorage.setItem(
            name,
            JSON.stringify({
              ...value.state,
              selectedRows: Array.from(value.state.selectedRows),
            }),
          );
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
);
