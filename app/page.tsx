"use client"

import { useEffect, useState } from "react"
import { useKeycloak } from "@/lib/context/KeycloakContext"
import AppLayout from "@/components/layout/app-layout"
import LandingPage from "./landing/page"
import LoadingScreen from "@/components/loading-screen"

export default function Home() {
  const { keycloak, initialized, isActivated } = useKeycloak()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (initialized) {
      setIsChecking(false)
    }
  }, [initialized])

  if (isChecking || !initialized) {
    return <LoadingScreen />
  }

  // If user is authenticated and activated, show the main app
  if (keycloak.authenticated && isActivated) {
    return <AppLayout />
  }

  // If user is not authenticated, show the landing page
  return <LandingPage />
}
