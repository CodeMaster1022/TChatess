import { apiClient } from "../utils/http"
import { getAuthToken } from "../utils/auth-utils"

export interface CreateUserRequest {
  username: string
  email: string
  status: "active" | "inactive" | "pending" | "suspended"
  role: "admin" | "user" | "viewer"
  tenant_id: string
  password?: string
}

export interface User {
  id: number
  username: string
  email: string
  role: "admin" | "user" | "viewer"
  status: "active" | "inactive" | "pending" | "suspended"
  tenant_id: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

export async function getUsers(): Promise<User[]> {
  const token = getAuthToken()
  if (!token) throw new Error("No authentication token")

  apiClient.setToken(token)
  const response = await apiClient.get<User[]>("/admin/users")
  console.log("=======================>>>>>")
  if (response.error) {
    throw new Error(response.error)
  }

  return response.data!
}

export async function createUser(userData: CreateUserRequest): Promise<User> {
  const token = getAuthToken()
  if (!token) throw new Error("No authentication token")

  apiClient.setToken(token)
  const response = await apiClient.post<User>("/admin/create", userData)

  if (response.error) {
    throw new Error(response.error)
  }

  return response.data!
}

export async function updateUser(user_id: number, userData: Partial<User>): Promise<User> {
  const token = getAuthToken()
  if (!token) throw new Error("No authentication token")

  apiClient.setToken(token)
  const response = await apiClient.put<User>(`/admin/users/${user_id}`, userData)

  if (response.error) {
    throw new Error(response.error)
  }

  return response.data!
}

export async function deleteUser(user_id: number): Promise<void> {
  const token = await getAuthToken()
  if (!token) throw new Error("No authentication token")

  apiClient.setToken(token)
  const response = await apiClient.delete(`/admin/users/${user_id}`)

  if (response.error) {
    throw new Error(response.error)
  }
}
