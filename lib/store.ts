import { configureStore } from "@reduxjs/toolkit"
import chatReducer from "./features/chat/chatSlice"
import authReducer from "./features/auth/authSlice"
import uiReducer from "./features/ui/uiSlice"
export const store = configureStore({
  reducer: {
    chat: chatReducer,
    auth: authReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
