"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateUser } from "@/lib/services/adminApi"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import type { User } from "@/lib/services/adminApi"

interface CurrentUser {
  id: number
  role: "admin" | "user" | "viewer"
  tenant_id: string
}

interface EditUserDialogProps {
  children: React.ReactNode
  user: User
  currentUser: CurrentUser
}

export function EditUserDialog({ children, user, currentUser }: EditUserDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: user.username,
    email: user.email,
    role: user.role,
    status: user.status,
    avatar_url: user.avatar_url || "",
  })

  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await updateUser(user.id, {
        username: formData.username,
        email: formData.email,
        role: formData.role,
        status: formData.status,
        avatar_url: formData.avatar_url || undefined,
      })

      toast({
        title: "User updated",
        description: `User ${formData.username} has been updated successfully.`,
      })

      setOpen(false)
      window.location.reload()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      status: user.status,
      avatar_url: user.avatar_url || "",
    })
    setOpen(false)
  }

  // Check if current user can edit this user
  const canEdit =
    currentUser.role === "admin" ||
    (currentUser.role === "user" && user.tenant_id === currentUser.tenant_id && user.id !== currentUser.id)

  if (!canEdit) {
    return null
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>Update user information. Changes will be saved immediately.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-username" className="text-right">
                Username
              </Label>
              <Input
                id="edit-username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="col-span-3"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-email" className="text-right">
                Email
              </Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="col-span-3"
                required
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-avatar" className="text-right">
                Avatar URL
              </Label>
              <Input
                id="edit-avatar"
                type="url"
                value={formData.avatar_url}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                className="col-span-3"
                placeholder="https://example.com/avatar.jpg"
                disabled={isLoading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-role" className="text-right">
                Role
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value: "admin" | "user" | "viewer") => setFormData({ ...formData, role: value })}
                disabled={isLoading || currentUser.role !== "admin"}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {currentUser.role === "admin" && <SelectItem value="admin">Admin</SelectItem>}
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="viewer">Viewer</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-status" className="text-right">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "inactive" | "pending" | "suspended") =>
                  setFormData({ ...formData, status: value })
                }
                disabled={isLoading}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Updating..." : "Update User"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}