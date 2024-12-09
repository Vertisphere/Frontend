import { Customer } from "@/types/customer";

const API_BASE_URL = "https://api.ordrport.com";

export class CustomerService {
  private static getAuthHeaders() {
    const idToken = sessionStorage.getItem("jwt");
    if (!idToken) {
      throw new Error("No authentication token found");
    }
    return {
      Authorization: `Bearer ${idToken}`,
      "Content-Type": "application/json",
    };
  }

  static async fetchCustomers(
    pageSize: number,
    currentPage: number,
  ): Promise<{ customers: Customer[] }> {
    const response = await fetch(`${API_BASE_URL}/qbCustomers`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized");
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async updateCustomer(
    customerId: string,
    customerData: Customer,
  ): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/qbCustomers/${customerId}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(customerData),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized");
      }
      throw new Error("Failed to update customer");
    }
  }
}
