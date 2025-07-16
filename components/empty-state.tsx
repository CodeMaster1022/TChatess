"use client"

import { useAppDispatch } from "@/lib/hooks/useAppDispatch"
import { createNewChat } from "@/lib/features/chat/chatSlice"
import { Button } from "@/components/ui/button"
import { Database, Plus, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

interface EmptyStateProps {
  toggleSidebar?: () => void
}

export default function EmptyState({ toggleSidebar }: EmptyStateProps) {
  const dispatch = useAppDispatch()

  const handleNewChat = () => {
    dispatch(createNewChat())
  }

  return (
    <div className="flex h-full flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header with mobile hamburger menu */}
      <div className="flex items-center justify-between py-2 border-b-2 border-indigo-500/30 dark:border-indigo-400/30 backdrop-blur-sm bg-white/30 dark:bg-slate-800/30">
        <div className="flex items-center gap-4">
          {/* Mobile hamburger menu button */}
          {toggleSidebar && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9 ml-2 rounded-xl hover:bg-white/50 dark:hover:bg-slate-700/50 transition-all duration-200"
              onClick={toggleSidebar}
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </Button>
          )}
          <h1 className="px-4 text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            SQL Assistant
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center justify-center space-y-6 text-center max-w-2xl">
          <div className="rounded-full bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6">
            <Database className="h-16 w-16 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Welcome to ChatESS
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Your intelligent data assistant
            </p>
            <p className="max-w-md text-slate-500 dark:text-slate-500">
              Ask questions about your data in natural language and get SQL queries and results instantly.
            </p>
          </div>
          
          <Button 
            onClick={handleNewChat} 
            className="mt-4 gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 rounded-xl px-6 py-3"
          >
            <Plus className="h-5 w-5" />
            Start New Conversation
          </Button>
        </div>
      </div>
    </div>
  )
}
