import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { chatApi } from "@/lib/services/chatApi"
import { v4 as uuidv4 } from "uuid"

// Types
export interface ChatMessage {
  id?: number
  question: string
  tenant_id: string
  user_id: number
  thread_id: string
  parent_id: string
  result?: {
    sql: string
    result: {
      results: any[]
      columns: string[]
      row_count: number
      success: boolean
      error: null | string
    }
    suggestions: string[]
  }
  created_at?: string
}

export interface ChatThread {
  id: string
  title: string
  messages: ChatMessage[]
  lastMessage?: string
  updatedAt?: string
}

export interface ChatState {
  threads: ChatThread[]
  activeThreadId: string | null
  currentQuestion: string
  isLoading: boolean
  error: string | null
  currentTaskId: string | null
  pollingActive: boolean
}

const initialState: ChatState = {
  threads: [],
  activeThreadId: null,
  currentQuestion: "",
  isLoading: false,
  error: null,
  currentTaskId: null,
  pollingActive: false,
}

// Async thunks
export const sendQuestion = createAsyncThunk(
  "chat/sendQuestion",
  async (question: ChatMessage, { dispatch, getState }) => {
    try {
      const state = getState() as { chat: ChatState }
      const { activeThreadId } = state.chat

      if (!activeThreadId) {
        throw new Error("No active thread")
      }

      const taskId = await chatApi.sendQuestion(question)
      dispatch(setCurrentTaskId(taskId))
      dispatch(startPolling())
      return { question, threadId: activeThreadId }
    } catch (error) {
      throw error
    }
  },
)

export const pollForResponse = createAsyncThunk(
  "chat/pollForResponse",
  async (taskId: string, { dispatch, getState }) => {
    try {
      const response = await chatApi.getResponse(taskId)
      const state = getState() as { chat: ChatState }
      const { activeThreadId } = state.chat

      if (response.status === "completed") {
        dispatch(stopPolling())
        return { result: response.result, threadId: activeThreadId }
      } else if (response.status === "error") {
        dispatch(stopPolling())
        return { result: response.result, threadId: activeThreadId }
      }

      // If not completed, continue polling
      return null
    } catch (error) {
      dispatch(stopPolling())
      throw error
    }
  },
)

export const fetchChatHistory = createAsyncThunk(
  "chat/fetchChatHistory",
  async ({ user_id, tenant_id }: { user_id: number; tenant_id: string }) => {
    try {
      const history = await chatApi.getChatHistory(user_id, tenant_id);
      
      // Group messages by thread_id
      const threadMap: Record<string, ChatThread> = {};
      
      history.forEach((message: any) => {
        const threadId = message.thread_id || uuidv4();
        
        if (!threadMap[threadId]) {
          // Create a new thread if it doesn't exist
          threadMap[threadId] = {
            id: threadId,
            title: message.question, // Use first message as title
            messages: [],
            lastMessage: "",
            updatedAt: new Date(0).toISOString(), // Will be updated below
          };
        }
        
        // Add message to the thread
        threadMap[threadId].messages.push(message);
        
        // Update thread metadata if this message is newer
        const messageDate = new Date(message.created_at);
        const threadDate = new Date(threadMap[threadId].updatedAt || 0);
        
        if (messageDate > threadDate) {
          threadMap[threadId].lastMessage = message.question;
          threadMap[threadId].updatedAt = message.created_at;
        }
      });
      
      // Sort threads by updatedAt (newest first)
      const threads = Object.values(threadMap).sort((a, b) => 
        new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime()
      );
      
      return threads;
    } catch (error) {
      throw error;
    }
  }
);

export const deleteThreadAsync = createAsyncThunk(
  "chat/deleteThreadAsync",
  async (threadId: string, { dispatch, getState }) => {
    try {
      const state = getState() as { auth: { tenant_id: string | null } }
      const { tenant_id } = state.auth
      
      if (!tenant_id) {
        throw new Error("Tenant ID is required to delete thread")
      }
      
      await chatApi.deleteThread(threadId, tenant_id);
      return threadId;
    } catch (error) {
      throw error;
    }
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentQuestion: (state, action: PayloadAction<string>) => {
      state.currentQuestion = action.payload
    },
    setCurrentTaskId: (state, action: PayloadAction<string>) => {
      state.currentTaskId = action.payload
    },
    startPolling: (state) => {
      state.pollingActive = true
    },
    stopPolling: (state) => {
      state.pollingActive = false
      state.currentTaskId = null
    },
    createNewChat: (state) => {
      const newThreadId = uuidv4()
      state.threads.unshift({
        id: newThreadId,
        title: "New Conversation",
        messages: [],
        updatedAt: new Date().toISOString(),
      })
      state.activeThreadId = newThreadId
    },
    selectChat: (state, action: PayloadAction<string>) => {
      state.activeThreadId = action.payload
    },
    updateThreadTitle: (state, action: PayloadAction<{ threadId: string; title: string }>) => {
      const { threadId, title } = action.payload
      const thread = state.threads.find((t) => t.id === threadId)
      if (thread) {
        thread.title = title
      }
    },
    deleteThread: (state, action: PayloadAction<string>) => {
      const threadId = action.payload
      const threadIndex = state.threads.findIndex((t) => t.id === threadId)

      if (threadIndex !== -1) {
        // Remove the thread
        state.threads.splice(threadIndex, 1)

        // If the active thread was deleted, set a new active thread
        if (state.activeThreadId === threadId) {
          state.activeThreadId = state.threads.length > 0 ? state.threads[0].id : null
        }
      }
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Send Question
      .addCase(sendQuestion.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(sendQuestion.fulfilled, (state, action) => {
        state.isLoading = true // Still loading while polling
        const { question, threadId } = action.payload
        const thread = state.threads.find((t) => t.id === threadId)

        if (thread) {
          thread.messages.push(question)
          thread.lastMessage = question.question
          thread.updatedAt = new Date().toISOString()

          // Update thread title if it's the first message
          if (thread.messages.length === 1 && thread.title === "New Conversation") {
            thread.title = question.question
          }
        }
      })
      .addCase(sendQuestion.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to send question"
      })

      // Poll for Response
      .addCase(pollForResponse.pending, (state) => {
        // Don't change loading state here as we're already loading
      })
      .addCase(pollForResponse.fulfilled, (state, action) => {
        if (action.payload) {
          const { result, threadId } = action.payload
          const thread = state.threads.find((t) => t.id === threadId)

          if (thread && result) {
            // Find the last message without a result and update it
            const lastPendingMessageIndex = [...thread.messages].reverse().findIndex((msg) => !msg.result)

            if (lastPendingMessageIndex !== -1) {
              const actualIndex = thread.messages.length - 1 - lastPendingMessageIndex
              // Ensure we have a valid result object with all required fields
              thread.messages[actualIndex].result = {
                sql: result.sql || "",
                result: {
                  results: result.result?.results || [],
                  columns: result.result?.columns || [],
                  row_count: result.result?.row_count || 0,
                  success: result.result?.success || false,
                  error: result.result?.error || null
                },
                suggestions: result.suggestions || []
              }
            }
          }

          state.isLoading = false
        }
      })
      .addCase(pollForResponse.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to get response"
      })

      // Fetch Chat History
      .addCase(fetchChatHistory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.isLoading = false
        state.threads = action.payload

        // Set the first thread as active if there are threads and no active thread
        if (state.threads.length > 0 && !state.activeThreadId) {
          state.activeThreadId = state.threads[0].id
        }
      })
      .addCase(fetchChatHistory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || "Failed to fetch chat history"
      })

      // Delete Thread
      .addCase(deleteThreadAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteThreadAsync.fulfilled, (state, action) => {
        const threadId = action.payload;
        const threadIndex = state.threads.findIndex((t) => t.id === threadId);

        if (threadIndex !== -1) {
          // Remove the thread
          state.threads.splice(threadIndex, 1);

          // If the active thread was deleted, set a new active thread
          if (state.activeThreadId === threadId) {
            state.activeThreadId = state.threads.length > 0 ? state.threads[0].id : null;
          }
        }
        state.isLoading = false;
        state.error = null; // Clear any previous errors
      })
      .addCase(deleteThreadAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to delete thread";
      });
  },
})

export const {
  setCurrentQuestion,
  setCurrentTaskId,
  startPolling,
  stopPolling,
  createNewChat,
  selectChat,
  updateThreadTitle,
  deleteThread,
  clearError,
} = chatSlice.actions

export default chatSlice.reducer
