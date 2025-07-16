"use client"

import './globals.css'
import { Provider } from "react-redux"
import { store } from "@/lib/store"
import { KeycloakProvider } from "@/lib/context/KeycloakContext"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>ChatESS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="shortcut icon" href="favicon.ico" />
      </head>
      <body>
        <Provider store={store}>
          <KeycloakProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </KeycloakProvider>
        </Provider>
      </body>
    </html>
  )
}
