"use client"
import React,  { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserTable } from "@/components/admin/user-table"
import { UserTableSkeleton } from "@/components/admin/user-table-skeleton"
import { CreateUserDialog } from "@/components/admin/create-user-dialog"
import { useAppSelector } from "@/lib/hooks/useAppSelector"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { toast } from "@/hooks/use-toast"

export default function UsersPage() {
  const router = useRouter()
  const { user_id, tenant_id, role } = useAppSelector((state) => state.auth)
  
  const currentUser = {
    id: user_id || 1,
    tenant_id: tenant_id || "tenant_id",
    role: role || "user",
  }

  useEffect(() => {
    if (role !== "admin") {
      toast({
        title: "Access Denied",
        description: "You do not have permission to access this page.",
        variant: "destructive",
      })
      router.push("/")
    }
  }, [role, router])

  if (role !== "admin") {
    return null
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
        <CreateUserDialog currentUser={currentUser}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </CreateUserDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>A list of all users with their roles and status</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<UserTableSkeleton />}>
            <UserTable />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}