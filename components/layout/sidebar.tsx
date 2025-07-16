"use client"

import React, { useEffect, useState } from "react"
import { useAppDispatch } from "@/lib/hooks/useAppDispatch"
import { useAppSelector } from "@/lib/hooks/useAppSelector"
import { createNewChat, selectChat, deleteThreadAsync, updateThreadTitle } from "@/lib/features/chat/chatSlice"
import { toggleSidebar as toggleSidebarCollapse } from "@/lib/features/ui/uiSlice"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import UserAvatar from "../user-avatar"
import {
  MessageSquare,
  Plus,
  ChevronLeft,
  MoreHorizontal,
  Pencil,
  Trash2,
  Check,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Image from "next/image"

interface SidebarProps {
  isOpen: boolean
  toggleSidebar: () => void
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const dispatch = useAppDispatch()
  const { threads, activeThreadId, isLoading } = useAppSelector((state) => state.chat)
  const [editingThreadId, setEditingThreadId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const { sidebarCollapsed } = useAppSelector((state) => state.ui)
  const [isMobile, setIsMobile] = useState(false)
  const [hoveredThreadId, setHoveredThreadId] = useState<string | null>(null)

  // Handle window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // lg breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close sidebar on mobile when selecting a chat
  const handleSelectChat = (threadId: string) => {
    dispatch(selectChat(threadId))
    if (isMobile) {
      toggleSidebar()
    }
  }

  // Close sidebar on mobile when creating new chat
  const handleNewChat = () => {
    dispatch(createNewChat())
    if (isMobile) {
      toggleSidebar()
    }
  }

  const handleEditThread = (threadId: string, currentTitle: string) => {
    setEditingThreadId(threadId)
    setEditTitle(currentTitle)
  }

  const handleSaveTitle = (threadId: string) => {
    if (editTitle.trim()) {
      dispatch(updateThreadTitle({ threadId, title: editTitle }))
    }
    setEditingThreadId(null)
  }

  const handleCancelEdit = () => {
    setEditingThreadId(null)
  }

  const handleDeleteThread = async (threadId: string) => {
    // Add confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to delete this conversation? This action cannot be undone.");
    
    if (!isConfirmed) {
      return;
    }

    try {
      await dispatch(deleteThreadAsync(threadId)).unwrap()
      // Optional: Show success message
      console.log("Thread deleted successfully")
    } catch (error) {
      console.error("Failed to delete thread:", error)
      // Show error message to user
      alert(`Failed to delete conversation: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const truncateTitle = (title: string, maxLength = 25) => {
    if (title.length <= maxLength) return title
    return title.substring(0, maxLength) + "..."
  }

  // Determine sidebar state based on device and collapse state
  const isSidebarVisible = isMobile ? isOpen : true
  const isSidebarCollapsed = !isMobile && sidebarCollapsed

  return (
    <>
      {/* Mobile overlay with blur effect */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300" 
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex flex-col bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-900 dark:to-slate-950/50 border-r border-slate-200/60 dark:border-slate-800/60 backdrop-blur-xl transition-all duration-300 ease-in-out",
          isMobile ? "w-80 shadow-2xl" : "lg:static shadow-lg",
          isMobile && !isOpen && "-translate-x-full",
          !isMobile && isSidebarCollapsed && "lg:w-16",
          !isMobile && !isSidebarCollapsed && "lg:w-[300px]",
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Header with gradient */}
        <div className="relative flex h-16 items-center border-b border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/30 dark:to-indigo-950/30 backdrop-blur-sm px-5">
        {!isSidebarCollapsed && (
          <div className="flex items-center gap-3 transition-all duration-200">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/25">
              <Image src='/logo.png' width={20} height={20} alt="logo" className="brightness-0 invert"/>
            </div>
            
              <div className="flex flex-col">
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                 ChatESS
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 -mt-1">
                  Your intelligent data assistant
                </p>
              </div>
           
          </div>
           )}
          
          <div className="ml-auto flex items-center gap-1">
            {!isMobile && (
              <>
                {isSidebarCollapsed ? (
                  <PanelLeftOpen 
                    className="hidden lg:block h-6 w-6 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer transition-all duration-200" 
                    onClick={() => dispatch(toggleSidebarCollapse())}
                    // title="Expand sidebar"
                  />
                ) : (
                  <PanelLeftClose 
                    className="hidden lg:block h-6 w-6 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 cursor-pointer transition-all duration-200" 
                    onClick={() => dispatch(toggleSidebarCollapse())}
                    // title="Collapse sidebar"
                  />
                )}
              </>
            )}
            {isMobile && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden h-8 w-8 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all duration-200" 
                onClick={toggleSidebar}
                aria-label="Close sidebar"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
            )}
          </div>
        </div>

        {/* New Chat Button with enhanced styling */}
        <div className="px-4 pt-6 pb-2">
          <Button
            className={cn(
              "group relative overflow-hidden border-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] transition-all duration-200 ease-out",
              "dark:from-blue-600 dark:to-indigo-700 dark:shadow-blue-600/20",
              isSidebarCollapsed ? "w-8 h-8 rounded-xl px-0 justify-center" : "w-full h-10 rounded-xl"
            )}
            onClick={handleNewChat}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            <Plus className={cn("transition-transform duration-200 group-hover:rotate-90", isSidebarCollapsed ? "h-5 w-5" : "h-5 w-5 mr-3")} />
            {!isSidebarCollapsed && <span className="font-semibold">New Conversation</span>}
          </Button>
        </div>

        {/* Chat List with improved styling */}
        <ScrollArea className="flex-1 px-3">
          <div className="space-y-1 py-2">
            {threads.map((thread, index) => (
              <div 
                key={thread.id} 
                className="relative group animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
                onMouseEnter={() => setHoveredThreadId(thread.id)}
                onMouseLeave={() => setHoveredThreadId(null)}
              >
                {editingThreadId === thread.id ? (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="h-9 text-sm border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSaveTitle(thread.id)
                        } else if (e.key === "Escape") {
                          handleCancelEdit()
                        }
                      }}
                    />
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                        onClick={() => handleSaveTitle(thread.id)}
                      >
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors" 
                        onClick={handleCancelEdit}
                      >
                        <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div
                      className={cn(
                        "flex-1 flex items-start gap-3 p-1 rounded-xl cursor-pointer transition-all duration-200 ease-out",
                        "hover:bg-slate-100/70 dark:hover:bg-slate-800/50 hover:scale-[1.01] hover:shadow-sm",
                        thread.id === activeThreadId 
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200/50 dark:border-blue-800/50 shadow-sm" 
                          : "hover:border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50",
                      )}
                      onClick={() => handleSelectChat(thread.id)}
                    >
                      <div className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-lg transition-all duration-200",
                        thread.id === activeThreadId 
                          ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-sm" 
                          : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      )}>
                        <MessageSquare className="h-4 w-4" />
                      </div>
                      
                      {!isSidebarCollapsed && (
                        <div className="flex-1 overflow-hidden">
                          <p className={cn(
                            "truncate font-medium transition-colors duration-200",
                            thread.id === activeThreadId 
                              ? "text-blue-900 dark:text-blue-100" 
                              : "text-slate-900 dark:text-slate-100"
                          )}>
                            {truncateTitle(thread.title || "New Conversation", 20)}
                          </p>
                          {/* {thread.lastMessage && (
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                              {truncateTitle(thread.lastMessage, 25)}
                            </p>
                          )} */}
                          {/* {thread.updatedAt && (
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1.5 font-medium">
                              {formatDistanceToNow(new Date(thread.updatedAt), { addSuffix: true })}
                            </p>
                          )} */}
                        </div>
                      )}
                      
                      {!isSidebarCollapsed && (
                        <div className={cn(
                          "flex-shrink-0 transition-all duration-200",
                          hoveredThreadId === thread.id ? "opacity-100 translate-x-0" : "opacity-70 translate-x-2"
                        )}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                }}
                              >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Thread options</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-44 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border border-slate-200/60 dark:border-slate-800/60 shadow-xl">
                              <DropdownMenuItem
                                className={cn(
                                  "transition-colors cursor-pointer",
                                  isLoading 
                                    ? "text-gray-400 dark:text-gray-500 cursor-not-allowed" 
                                    : "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50"
                                )}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  if (!isLoading) {
                                    handleDeleteThread(thread.id)
                                  }
                                }}
                                disabled={isLoading}
                              >
                                {isLoading ? (
                                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600" />
                                ) : (
                                  <Trash2 className="mr-2 h-4 w-4" />
                                )}
                                {isLoading ? "Deleting..." : "Delete conversation"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {threads.length === 0 && !isSidebarCollapsed && (
              <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center mb-4">
                  <MessageSquare className="h-8 w-8 text-slate-400 dark:text-slate-500" />
                </div>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">No conversations yet</p>
                <p className="text-xs text-slate-500 dark:text-slate-500">Start a new chat to begin</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer with enhanced styling */}
        <div className="border-t border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-r from-slate-50/50 to-slate-100/50 dark:from-slate-900/50 dark:to-slate-950/50 p-4">
          <div className={cn(
            "flex items-center gap-3 transition-all duration-200",
            isSidebarCollapsed ? "justify-center" : ""
          )}>
            <div className="relative">
              <UserAvatar />
              {/* <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-slate-900 shadow-sm"></div> */}
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">My Profile</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Online</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}