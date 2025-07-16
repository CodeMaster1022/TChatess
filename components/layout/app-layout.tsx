"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/layout/sidebar"
import ChatPage from "@/components/layout/chat-page"
import { useAppDispatch } from "@/lib/hooks/useAppDispatch"
import { useAppSelector } from "@/lib/hooks/useAppSelector"
import { fetchChatHistory } from "@/lib/features/chat/chatSlice"
import { useMobile } from "@/hooks/use-mobile"
import LoadingScreen from "@/components/loading-screen"
export default function AppLayout() {
  const dispatch = useAppDispatch()
  const { activeThreadId } = useAppSelector((state) => state.chat)
  const { user_id, tenant_id } = useAppSelector((state) => state.auth)
  const [initialLoading, setInitialLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const isMobile = useMobile()
  useEffect(() => {
    const loadChatHistory = async () => {
      if (user_id === null || tenant_id === null) return
      setInitialLoading(true)
      await dispatch(fetchChatHistory({ user_id, tenant_id }))
      setInitialLoading(false)
    }
    loadChatHistory()
  }, [dispatch])

  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false)
    } else {
      setSidebarOpen(true)
    }
  }, [isMobile])

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  if (initialLoading) {
    return <LoadingScreen />
  }
  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      <ChatPage isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    </div>
  )
}
