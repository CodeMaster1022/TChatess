"use client" // You need this since you're using hooks

import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { useAppSelector } from "@/lib/hooks/useAppSelector"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import LoadingScreen from "@/components/loading-screen"
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { role, userEmail, isLoading } = useAppSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    if (!isLoading && (!role || !userEmail)) {
      toast({
        title: "Session Expired",
        description: "Your session has expired. Please login again.",
        variant: "destructive",
      })
      router.push("/login")
    }
  }, [role, userEmail, isLoading, router])

  if (isLoading) {
    return <LoadingScreen />
  }

  // If not authenticated, don't render the layout
  // if (!role || !userEmail) {
  //   return null
  // }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b">
          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => router.push("/")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Main
          </Button>
        </div>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}