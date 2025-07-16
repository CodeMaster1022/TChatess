"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import LoadingScreen from "../loading-screen"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LayoutDashboard, Users, Building2, Settings, LogOut, Shield } from "lucide-react"
import { useAppDispatch } from "@/lib/hooks/useAppDispatch"
import { useAppSelector } from "@/lib/hooks/useAppSelector"
import { useEffect, useState } from "react"

export function AdminSidebar() {
  const pathname = usePathname()
  const { isLoading } = useAppSelector((state) => state.auth)
  
  if (isLoading) {
    return <LoadingScreen />
  }

  const navigation = [
    {
      name: "Users",
      href: "/admin/users",
      icon: Users,
      current: pathname?.startsWith("/admin/users"),
    },
    // ...(role === "admin"
    //   ? [
    //       {
    //         name: "Tenants",
    //         href: "/admin/tenants",
    //         icon: Building2,
    //         current: pathname?.startsWith("/admin/tenants"),
    //       },
    //     ]
    //   : []),
  ]

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="flex items-center h-16 px-4 border-b border-gray-200">
        <Shield className="h-8 w-8 text-blue-600" />
        <span className="ml-2 text-xl font-semibold">Admin Panel</span>
      </div>

      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        <nav className="mt-5 flex-1 px-2 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                item.current ? "bg-blue-100 text-blue-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
              )}
            >
              <item.icon
                className={cn(
                  item.current ? "text-blue-500" : "text-gray-400 group-hover:text-gray-500",
                  "mr-3 flex-shrink-0 h-6 w-6",
                )}
              />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
        <div className="flex items-center w-full">
          {/* <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg" alt="User avatar" />
            <AvatarFallback>{role?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar> */}
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-700">Admin User</p>
            {/* <p className="text-xs text-gray-500 capitalize">{role}</p> */}
          </div>
          {/* <Button variant="ghost" size="sm">
            <LogOut className="h-4 w-4" />
          </Button> */}
        </div>
      </div>
    </div>
  )
}