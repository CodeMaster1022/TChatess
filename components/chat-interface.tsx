"use client"

import type React from "react"
import { v4 as uuidv4 } from 'uuid';
import { useEffect, useRef, useState } from "react"
import { useAppDispatch } from "@/lib/hooks/useAppDispatch"
import { useAppSelector } from "@/lib/hooks/useAppSelector"
import { sendQuestion, pollForResponse, setCurrentQuestion } from "@/lib/features/chat/chatSlice"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Send, Database, FileText, Upload, X, FileText as DocIcon, File as TxtIcon, Image, MessageSquare, Menu } from "lucide-react"
import ChatMessage from "@/components/chat-message"
import { simulateS3Upload } from "@/lib/utils/simulatedS3Upload"
import { FileUploadDialog } from "@/components/file-upload-dialog"
import { cn } from "@/lib/utils"
import UserAvatar from "./user-avatar";

// const ALLOWED_FILE_TYPES = {
//   'application/pdf': 'PDF',
//   'application/msword': 'DOC',
//   'text/plain': 'TXT',
//   'image/*': 'Image'
// }
// const ACCEPT_FILE_TYPES = Object.keys(ALLOWED_FILE_TYPES).join(',')

interface ChatInterfaceProps {
  mode?: 'database' | 'document';
  toggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export default function ChatInterface({ mode = 'database', toggleSidebar, isSidebarOpen }: ChatInterfaceProps) {
  const dispatch = useAppDispatch()
  const { threads, activeThreadId, currentQuestion, isLoading, error, currentTaskId, pollingActive } = useAppSelector(
    (state) => state.chat,
  )
  const { user_id, tenant_id, tenant_role } = useAppSelector((state) => state.auth)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [currentMode, setCurrentMode] = useState<'database' | 'document'>(mode);
  // const [isDragging, setIsDragging] = useState(false)
  const activeThread = threads.find((thread) => thread.id === activeThreadId)
  const messages = activeThread?.messages || []
  // const [extractedContents, setExtractedContents] = useState<{ [key: string]: string }>({})

  // Compose string p from tenant_role (keys only)
  let permission_db = '';
  if (tenant_role) {
    const keys = ['TMS', 'CRM', 'FMS', 'WMS'];
    permission_db = keys
      .filter((key) => tenant_role[key]?.role_id)
      .join(', ');
  }

  // Set up polling mechanism
  useEffect(() => {
    let pollingInterval: NodeJS.Timeout | null = null

    if (pollingActive && currentTaskId) {
      pollingInterval = setInterval(() => {
        dispatch(pollForResponse(currentTaskId))
      }, 1000) // Poll every second
    }

    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval)
      }
    }
  }, [pollingActive, currentTaskId, dispatch])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [activeThreadId])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentQuestion.trim() || !activeThreadId || !tenant_id) return

    // if (currentMode === 'document' && selectedFiles.length === 0) {
    //   alert("Please upload at least one document")
    //   return
    // }

    const newQuestion = {
      tenant_id: tenant_id,
      question: currentQuestion,
      user_id: Number(user_id),
      thread_id: activeThreadId,
      parent_id: uuidv4(),
      permission_db: permission_db
    }

    dispatch(sendQuestion(newQuestion))
    dispatch(setCurrentQuestion(""))
    // setSelectedFiles([])
  }

  // const handleFileUploadSuccess = async (file: File, fileUrl: string) => {
  //   setExtractingFiles(prev => ({ ...prev, [file.name]: true }))
  //   try {
  //   } catch (error) {
  //     alert(`Error extracting content from ${file.name}`)
  //   } finally {
  //     setExtractingFiles(prev => ({ ...prev, [file.name]: false }))
  //   }
  // }

  // const handleFileSelect = async (files: File[]) => {
  //   setSelectedFiles(prev => [...prev, ...files])
  //   for (const file of files) {
  //     if (file.size === 0) {
  //       setUploadedFileUrls(prev => ({ ...prev, [file.name]: "history" }))
  //       continue
  //     }
  //     setUploadingFiles(prev => ({ ...prev, [file.name]: true }))
  //     try {
  //       const result = await simulateS3Upload(file)
  //       if (result.success) {
  //         setUploadedFileUrls(prev => ({ ...prev, [file.name]: result.fileUrl }))
  //         setUploadedFilesHistory(prev => [...prev, {
  //           name: file.name,
  //           url: result.fileUrl,
  //           uploadedAt: new Date()
  //         }])
  //         await handleFileUploadSuccess(file, result.fileUrl)
  //       } else {
  //         alert(`Failed to upload ${file.name}: ${result.error}`)
  //       }
  //     } catch (error) {
  //       alert(`Error uploading ${file.name}`)
  //     } finally {
  //       setUploadingFiles(prev => ({ ...prev, [file.name]: false }))
  //     }
  //   }
  // }

  // const removeFile = (index: number) => {
  //   setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = ''
  //   }
  // }

  const handleSuggestionClick = async (suggestion: string) => {
    if (!activeThreadId || !tenant_id) return//thys

    // if (currentMode === 'document' && selectedFiles.length === 0) {
    //   alert("Please upload at least one document")
    //   return
    // }

    const newQuestion = {
      tenant_id: tenant_id,
      question: suggestion,
      user_id: Number(user_id),
      thread_id: activeThreadId,
      parent_id: uuidv4(),
    }

    dispatch(sendQuestion(newQuestion))
    dispatch(setCurrentQuestion(""))
    // setSelectedFiles([])
  }

  // const getFileIcon = (file: File) => {
  //   if (file.type === 'application/pdf') {
  //     return <FileText className="h-8 w-8 text-red-500" />
  //   } else if (file.type.includes('word')) {
  //     return <DocIcon className="h-8 w-8 text-blue-500" />
  //   } else {
  //     return <TxtIcon className="h-8 w-8 text-gray-500" />
  //   }
  // }
  return (
    <div className="flex flex-col overflow-hidden h-full bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 max-w-[1400px] mx-auto">
      {/* Header with Mode Toggle */}
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
        
        <div className="flex items-center gap-2 p-1 bg-white/50 dark:bg-slate-700/50 rounded-xl border border-white/20">
          <UserAvatar />
        </div>
      </div>

      {/* Chat Messages Area */}
      <div 
        className="flex-1 overflow-y-auto sm:p-6 p-2 space-y-6"
        // onDragOver={handleDragOver}
        // onDrop={handleDrop}
      >
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} onSuggestionClick={handleSuggestionClick} />
        ))}

        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <div className="flex items-center gap-3 px-6 py-4 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg">
              <Loader2 className="h-5 w-5 animate-spin text-indigo-600" />
              <span className="text-gray-700 dark:text-gray-300 font-medium">Thinking...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mx-auto max-w-md p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl backdrop-blur-sm">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* File Upload Area */}
      {/* {currentMode === 'document' && (
        <div className="border-t border-white/20 backdrop-blur-sm">
          ...
        </div>
      )} */}

      {/* Input Area */}
      <div className="p-2 sm:p-6 bg-white/30 dark:bg-slate-800/30 backdrop-blur-sm border-t border-white/20">
        <form onSubmit={handleSubmit} className="flex gap-2 sm:gap-4">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={currentQuestion}
              onChange={(e) => dispatch(setCurrentQuestion(e.target.value))}
              placeholder={currentMode === 'database' ? "Ask a question about your database..." : "Ask a question about your documents..."}
              className="md:h-12 h-10 sm:h-8 px-4 sm:px-6 text-base sm:text-lg bg-white/70 dark:bg-slate-700/70 border-2 border-white/30 dark:border-slate-600/30 rounded-xl sm:rounded-2xl focus:border-indigo-400 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all duration-300 placeholder:text-gray-500 dark:placeholder:text-gray-400 backdrop-blur-sm shadow-lg"
              disabled={isLoading}
            />
          </div>

          <div className="flex gap-2 sm:gap-3">
            {/* {currentMode === 'document' && (
              <FileUploadDialog
                onFileSelect={handleFileSelect}
                uploadedFiles={uploadedFilesHistory}
              >
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 md:h-12 md:w-12 rounded-xl sm:rounded-2xl border-2 border-white/30 dark:border-slate-600/30 bg-white/70 dark:bg-slate-700/70 hover:bg-white/90 dark:hover:bg-slate-600/90 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-300 shadow-lg hover:shadow-xl backdrop-blur-sm"
                  >
                    <Upload className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" />
                  </Button>
              </FileUploadDialog>
            )} */}

            <Button
              type="submit"
              disabled={isLoading || !currentQuestion.trim()}
              className="h-10 w-10 md:h-12 md:w-12 rounded-xl sm:rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              ) : (
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
