"use client"

import React,  { useState } from "react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, HelpCircle, Moon, Sun, UsersRound } from "lucide-react"
import { useTheme } from "next-themes"
import { useKeycloak } from "@/lib/context/KeycloakContext"
import { useAppSelector } from "@/lib/hooks/useAppSelector"
const TOKEN_KEY = "auth_chatess_token";
const REFRESH_TOKEN_KEY = "refresh_chatess_token";

export default function UserAvatar() {
  const router = useRouter()
  const { keycloak } = useKeycloak()
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { user_id, tenant_id, role } = useAppSelector((state) => state.auth)
  const handleLogout = async () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    await keycloak.logout()
  }

  const userEmail = keycloak.tokenParsed?.email || ''
  const userInitials = userEmail.charAt(0).toUpperCase()

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full p-0 transition-all duration-300 hover:scale-110 hover:shadow-xl group"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse" />
          <div className="absolute inset-0.5 rounded-full bg-background" />
          <Avatar className="relative h-8 w-8 border-2 border-transparent bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600 transition-all duration-300">
            <AvatarImage src={keycloak.tokenParsed?.picture} alt={userEmail} className="rounded-full" />
            <AvatarFallback className="text-white font-bold text-base bg-gradient-to-tr from-blue-600 via-purple-600 to-pink-600">
              {userInitials}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 border-2 border-background shadow-lg animate-pulse" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-80 rounded-2xl shadow-2xl border-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl p-0 mt-3 overflow-hidden"
        align="end"
        forceMount
        sideOffset={8}
      >
        {/* User Info Header */}
        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 px-2 py-2 text-white">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative flex items-center space-x-2">
            <div className="relative">
              <Avatar className="h-8 w-8 border-3 border-white/30 shadow-xl">
                <AvatarImage src={keycloak.tokenParsed?.picture} alt={userEmail} />
                <AvatarFallback className="text-white font-bold text-xl bg-white/20 backdrop-blur">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-400 border-3 border-white shadow-lg" />
            </div>
            <div className="flex flex-col flex-1 min-w-0 max-w-[200px]">
              {/* <p className="text-lg font-bold truncate text-white drop-shadow-sm">
                {userEmail.split('@')[0]}
              </p> */}
              <p className="text-sm text-white/80 truncate drop-shadow-sm">
                {userEmail}
              </p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/20 text-white backdrop-blur border border-white/30">
                  {role === "admin" ? "Administrator" : "User"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-3 space-y-1">
          <DropdownMenuGroup>
            <DropdownMenuItem 
              // onClick={}
              className="rounded-xl px-2 py-1 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-slate-800 dark:hover:to-slate-700 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center space-x-3 w-full">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 group-hover:scale-110 transition-transform duration-200">
                  <User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Profile</span>
                  {/* <span className="text-xs text-muted-foreground">Manage your account</span> */}
                </div>
              </div>
            </DropdownMenuItem>

            {role === "admin" && (
              <DropdownMenuItem 
                onClick={() => router.push("/admin/users")}
                className="rounded-xl px-2 py-1 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-slate-800 dark:hover:to-slate-700 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center space-x-3 w-full">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 group-hover:scale-110 transition-transform duration-200">
                    <UsersRound className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium">User Management</span>
                    {/* <span className="text-xs text-muted-foreground">Manage team members</span> */}
                  </div>
                </div>
              </DropdownMenuItem>
            )}

            <DropdownMenuItem 
              // onClick={}
              className="rounded-xl px-2 py-3 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 dark:hover:from-slate-800 dark:hover:to-slate-700 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center space-x-3 w-full">
                <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 group-hover:scale-110 transition-transform duration-200">
                  <Settings className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Settings</span>
                  {/* <span className="text-xs text-muted-foreground">Preferences & privacy</span> */}
                </div>
              </div>
            </DropdownMenuItem>

            <DropdownMenuItem 
              // onClick={}
              className="rounded-xl px-2 py-1 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 dark:hover:from-slate-800 dark:hover:to-slate-700 transition-all duration-200 cursor-pointer group"
            >
              <div className="flex items-center space-x-3 w-full">
                <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30 group-hover:scale-110 transition-transform duration-200">
                  <HelpCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">Help & Support</span>
                  {/* <span className="text-xs text-muted-foreground">Get assistance</span> */}
                </div>
              </div>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="my-3 bg-gradient-to-r from-transparent via-border to-transparent" />

          <DropdownMenuItem
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-xl px-2 py-1 hover:bg-gradient-to-r hover:from-slate-50 hover:to-gray-50 dark:hover:from-slate-800 dark:hover:to-slate-700 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-center space-x-3 w-full">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:scale-110 transition-transform duration-200">
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Moon className="h-4 w-4 text-slate-600" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="font-medium">{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                {/* <span className="text-xs text-muted-foreground">Switch appearance</span> */}
              </div>
            </div>
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-3 bg-gradient-to-r from-transparent via-border to-transparent" />

          <DropdownMenuItem 
            onClick={handleLogout}
            className="rounded-xl px-2 py-1 hover:bg-gradient-to-r hover:from-red-50 hover:to-rose-50 dark:hover:from-red-900/20 dark:hover:to-rose-900/20 transition-all duration-200 cursor-pointer group text-red-600 dark:text-red-400"
          >
            <div className="flex items-center space-x-3 w-full">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 group-hover:scale-110 transition-transform duration-200">
                <LogOut className="h-4 w-4 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium">Sign Out</span>
                <span className="text-xs text-red-400 dark:text-red-500">End your session</span>
              </div>
            </div>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}