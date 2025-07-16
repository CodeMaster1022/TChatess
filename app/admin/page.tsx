"use client"

import { useState } from "react"
import { useAppDispatch } from "@/lib/hooks/useAppDispatch"
import { useAppSelector } from "@/lib/hooks/useAppSelector"

export default function AdminDashboard() {
    const { user_id, tenant_id, role } = useAppSelector((state) => state.auth)
    
    return (
        <div className="mb-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back</p>
        </div>
    );
}