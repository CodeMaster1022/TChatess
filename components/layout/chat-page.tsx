"use client"

import { useAppSelector } from "@/lib/hooks/useAppSelector"
import ChatInterface from "@/components/chat-interface"
import EmptyState from "@/components/empty-state"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import UserAvatar from "../user-avatar"
interface ChatPageProps {
  isOpen: boolean
  toggleSidebar: () => void
}

export default function ChatPage({ isOpen, toggleSidebar }: ChatPageProps) {
  const { activeThreadId, threads } = useAppSelector((state) => state.chat)

  const activeThread = threads.find((thread) => thread.id === activeThreadId)

  const truncateTitle = (title: string, maxLength = 30) => {
    if (title.length <= maxLength) return title
    return title.substring(0, maxLength) + "..."
  }
  return (
    <div
      className={cn(
        "flex flex-1 flex-col h-screen transition-all duration-300 ease-in-out overflow-auto",
        isOpen ? "lg:ml-0" : "ml-0",
      )}
    >
      {/* Main Content */}
      <main className="flex-1 overflow-hidden p-0">{activeThreadId ? <ChatInterface toggleSidebar={toggleSidebar} isSidebarOpen={isOpen} /> : <EmptyState toggleSidebar={toggleSidebar} />}</main>
    </div>
  )
}
