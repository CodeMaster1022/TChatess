interface ApiResponse<T> {
    data?: T
    error?: string
    message?: string
  }
  
  class ApiClient {
    private baseUrl: string
    private token: string | null = null
  
    constructor(baseUrl: string = "https://api.chatess.com/api") {
      this.baseUrl = baseUrl
    }
  
    setToken(token: string) {
      this.token = token
    }
  
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
      const url = `${this.baseUrl}${endpoint}`
  
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string> || {}),
      }
  
      if (this.token) {
        headers["Authorization"] = `Bearer ${this.token}`
      }
  
      try {
        const response = await fetch(url, {
          ...options,
          headers,
        })
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          return {
            error: `${errorData.detail || `HTTP ${response.status}: ${response.statusText}`}`,
          }
        }
  
        const data = await response.json()
        return { data }
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : "Network error occurred",
        }
      }
    }
  
    async get<T>(endpoint: string): Promise<ApiResponse<T>> {
      return this.request<T>(endpoint, { method: "GET" })
    }
  
    async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
      return this.request<T>(endpoint, {
        method: "POST",
        body: data ? JSON.stringify(data) : undefined,
      })
    }
  
    async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
      return this.request<T>(endpoint, {
        method: "PUT",
        body: data ? JSON.stringify(data) : undefined,
      })
    }
  
    async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
      return this.request<T>(endpoint, { method: "DELETE" })
    }
  }
  
  export const apiClient = new ApiClient()