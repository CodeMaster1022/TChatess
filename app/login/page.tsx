"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useKeycloak } from "@/lib/context/KeycloakContext"
import LoadingScreen from "@/components/loading-screen"

export default function LoginPage() {
  const router = useRouter()
  const { keycloak, initialized, isActivated } = useKeycloak()

  useEffect(() => {
    if (initialized) {
      if (keycloak.authenticated && isActivated) {
        // User is already authenticated and activated, redirect to home
        router.push("/")
      } else if (!keycloak.authenticated) {
        // User is not authenticated, redirect to Keycloak login
        keycloak.login()
      }
      // If user is authenticated but not activated, stay on page to show activation message
    }
  }, [initialized, keycloak.authenticated, isActivated, router, keycloak])

  // Show loading screen while Keycloak is initializing
  if (!initialized) {
    return <LoadingScreen />
  }

  // If user is authenticated but not activated, show activation message
  if (keycloak.authenticated && !isActivated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Account Not Activated</h2>
            <p className="text-gray-600 dark:text-gray-300">
              You are not activated from admin. Please contact your administrator for access.
            </p>
          </div>
          <button
            onClick={() => keycloak.logout()}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    )
  }

  // This should not be reached, but just in case
  return <LoadingScreen />
}
