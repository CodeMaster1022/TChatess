"use client"

import { useState, useMemo } from "react"
import type { ChatMessage as ChatMessageType } from "@/lib/features/chat/chatSlice"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, ThumbsDown, ArrowRight, Sparkles, MessageSquare, Bot, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WideTableView from "./wide-table"
import DataVisualization from "@/components/data-visualization"

interface ChatMessageProps {
  message: ChatMessageType
  onSuggestionClick: (suggestion: string) => void
}

export default function ChatMessage({ message, onSuggestionClick }: ChatMessageProps) {
  const [feedbackGiven, setFeedbackGiven] = useState<'positive' | 'negative' | null>(null)
  const [activeTab, setActiveTab] = useState<"table" | "visualization">("table")
  // Format the timestamp if available
  const formattedTime = message.created_at
    ? format(new Date(message.created_at), "MMM d, h:mm a")
    : format(new Date(), "MMM d, h:mm a")

  // Check if data is suitable for visualization
  const canVisualize = useMemo(() => {
    if (!message.result?.result.results || message.result.result.results.length === 0) {
      return false
    }

    // Check if there's at least one numeric column
    const hasNumericData = message.result.result.columns.some((column) => {
      return message.result?.result.results.some((row) => typeof row[column] === "number")
    })

    return hasNumericData
  }, [message.result?.result.results, message.result?.result.columns])

  const handleFeedback = (type: 'positive' | 'negative') => {
    setFeedbackGiven(type)
    // Here you could add logic to save feedback
  }

  return (
    <div className="space-y-8 overflow-auto">
      {/* User Question */}
      <div className={cn(
        "flex gap-4 max-w-4xl animate-fade-in",
        "ml-auto"
      )}>
        <div className="flex-1 space-y-3 flex flex-col items-end">
          <div className="px-4 py-2  rounded-2xl shadow-lg backdrop-blur-sm border transition-all duration-300 hover:shadow-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-200/20 max-w-lg">
            <p className="text-sm leading-relaxed text-white">
              {message.question}
            </p>
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400 text-right">
            {formattedTime}
          </div>
        </div>
        <div className="flex-shrink-0 md:w-10 md:h-10 w-8 h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center shadow-lg">
          <User className="h-4 w-4 text-white" />
        </div>
      </div>

      {/* Assistant Response */}
      {message.result && message.result.sql ? (
        <div className={cn(
          "flex gap-4 max-w-4xl animate-fade-in",
          "mr-auto"
        )}>
          <div className="flex-shrink-0 hidden md:flex md:w-10 md:h-10 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 space-y-6 overflow-auto">
            <div className="px-4 sm:px-6 py-2 sm:py-4 rounded-2xl shadow-lg backdrop-blur-sm border transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-800/80 text-gray-800 dark:text-gray-200 border-white/20 dark:border-slate-700/20">
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {message.result.suggestions?.[0]}
              </p>
            </div>
            {/* Results Section */}
            <Card className="border-border/50 shadow-sm bg-background/80 backdrop-blur-sm">
              <div className="hidden md:block bg-gradient-to-r from-muted/50 via-muted/30 to-transparent p-4 border-b border-border/50">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <div className="h-5 w-5 rounded bg-primary/20 flex items-center justify-center">
                    <div className="h-2 w-2 bg-primary rounded-full"></div>
                  </div>
                  Query Results
                </h3>
              </div>

              <div className="sm:p-6 p-2">
                {activeTab === "table" ? (
                  <WideTableView
                    data={message.result.result.results}
                    columns={message.result.result.columns}
                    title="Query Results"
                    sql={message.result.sql}
                    showTabs={true}
                    canVisualize={canVisualize}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                  />
                ) : (
                  <div className="space-y-6">
                    {/* Controls Header for Visualization */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-2 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl border border-border/50">
                      <div className="flex items-center gap-2 w-full flex-wrap">
                        {/* Tab Controls */}
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8"
                          onClick={() => setActiveTab("table")}
                        >
                          Table View
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-8 bg-background shadow-sm"
                        >
                          Visualization
                        </Button>
                      </div>
                    </div>
                    
                    <Card className="overflow-hidden border-border/50">
                      <div className="p-4 bg-gradient-to-r from-muted/30 to-transparent border-b border-border/50">
                        <h4 className="font-medium text-foreground">Data Visualization</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Interactive charts and graphs based on your data
                        </p>
                      </div>
                      <div className="sm:p-6 p-2">
                        <DataVisualization
                          data={message.result.result.results}
                          columns={message.result.result.columns}
                        />
                      </div>
                    </Card>
                  </div>
                )}
              </div>
            </Card>

            {/* Follow-up Suggestions */}
            {message.result.suggestions && message.result.suggestions.slice(1)?.length > 0 && (
              <div className="space-y-3 overflow-hidden">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-medium">Suggested follow-ups:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {message.result.suggestions.slice(1).map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => onSuggestionClick(suggestion)}
                      className="text-xs bg-white/60 dark:bg-slate-700/60 border-white/30 dark:border-slate-600/30 hover:bg-indigo-50 dark:hover:bg-slate-600 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all duration-200 backdrop-blur-sm shadow-sm hover:shadow-md"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Feedback Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">
                  Was this response helpful?
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant={feedbackGiven === 'positive' ? 'default' : 'ghost'}
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0 transition-all duration-200",
                      feedbackGiven === 'positive' 
                        ? "bg-green-500 hover:bg-green-600 text-white" 
                        : "hover:bg-green-50 hover:text-green-600"
                    )}
                    onClick={() => handleFeedback('positive')}
                  >
                    <ThumbsUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={feedbackGiven === 'negative' ? 'default' : 'ghost'}
                    size="sm"
                    className={cn(
                      "h-8 w-8 p-0 transition-all duration-200",
                      feedbackGiven === 'negative' 
                        ? "bg-red-500 hover:bg-red-600 text-white" 
                        : "hover:bg-red-50 hover:text-red-600"
                    )}
                    onClick={() => handleFeedback('negative')}
                  >
                    <ThumbsDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {feedbackGiven && (
                <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-full">
                  Feedback saved
                </span>
              )}
            </div>
          </div>
        </div>
      ):(
        message.result && message.result.result.error && (
        <>
        <div className={cn(
          "flex gap-4 max-w-4xl animate-fade-in",
          "mr-auto"
        )}>
          <div className="flex-shrink-0 hidden md:flex md:w-10 md:h-10 w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 space-y-6 overflow-auto">
            <div className="px-6 py-4 rounded-2xl shadow-lg backdrop-blur-sm border transition-all duration-300 hover:shadow-xl bg-white/80 dark:bg-slate-800/80 text-gray-800 dark:text-gray-200 border-white/20 dark:border-slate-700/20">
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
              {message?.result?.result.error}
              </p>
            </div>
          </div>
        </div>
        </>
        )
      )}
    </div>
  )
}