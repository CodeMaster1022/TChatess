"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useKeycloak } from "@/lib/context/KeycloakContext"
import LoadingScreen from "@/components/loading-screen"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { keycloak, initialized } = useKeycloak()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (initialized) {
      if (!keycloak.authenticated) {
        if (pathname !== "/login" && pathname !== "/register" && pathname !== "/forgot-password") {
          router.push("/login")
        }
      }
      setIsChecking(false)
    }
  }, [initialized, keycloak.authenticated, router, pathname, isChecking])

  if (isChecking || !initialized) {
    return <LoadingScreen />
  }

  if (keycloak.authenticated && (pathname === "/login" || pathname === "/register" || pathname === "/forgot-password")) {
    router.push("/")
    return <LoadingScreen />
  }

  if (pathname === "/login" || pathname === "/register" || pathname === "/forgot-password" || keycloak.authenticated) {
    return <>{children}</>
  }

  return <LoadingScreen />
}
