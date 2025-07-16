export interface Tenant {
    id: string
    name: string
  }
  
  export interface TenantResponse {
    success: boolean
    data: Tenant[]
    total: number
    error?: string
    message?: string
  }
  
  export interface SingleTenantResponse {
    success: boolean
    data: Tenant
    error?: string
    message?: string
  }
  
  export const tenantApi = {
    // Get all tenants with optional filters
    getTenants: async (filters?: {
      status?: string
      allowSelfRegistration?: boolean
    }): Promise<TenantResponse> => {
      try {
        const params = new URLSearchParams()
  
        if (filters?.status) {
          params.append("status", filters.status)
        }
  
        if (filters?.allowSelfRegistration !== undefined) {
          params.append("allowSelfRegistration", filters.allowSelfRegistration.toString())
        }
  
        const url = `/api/tenants${params.toString() ? `?${params.toString()}` : ""}`
        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
  
        const data = await response.json()
        return data
      } catch (error) {
        console.error("Error fetching tenants:", error)
        throw new Error("Failed to fetch tenants")
      }
    },
  
    // Get a specific tenant by ID
    getTenant: async (id: string): Promise<SingleTenantResponse> => {
      try {
        const response = await fetch(`/api/tenants/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
  
        const data = await response.json()
        return data
      } catch (error) {
        console.error("Error fetching tenant:", error)
        throw new Error("Failed to fetch tenant")
      }
    },
  
    // Get tenants available for self-registration
    getAvailableTenantsForRegistration: async (): Promise<TenantResponse> => {
      return tenantApi.getTenants({
        status: "active",
        allowSelfRegistration: true,
      })
    },
  
    // Create a new tenant (for admin use)
    createTenant: async (tenantData: {
      name: string
      description: string
      domain: string
      plan?: string
    }): Promise<SingleTenantResponse> => {
      try {
        const response = await fetch("/api/tenants", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tenantData),
        })
  
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
        }
  
        const data = await response.json()
        return data
      } catch (error) {
        console.error("Error creating tenant:", error)
        throw error
      }
    },
  
    // Fetch tenant details by email from external API
    getTenantByEmail: async (email: string) => {
      try {
        const response = await fetch(`https://stage.shiper.io/api/user/get-tenant?email=${encodeURIComponent(email)}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch tenant details: ${response.status}`);
        }
        const data = await response.json();
        console.log("API Response:", data.result,'--------------------------------------');
        return data.result;
      } catch (error) {
        console.error("Error fetching tenant by email:", error);
        throw error;
      }
    },
  }
  