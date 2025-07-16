"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, Edit, Trash2, UserCheck, UserX } from "lucide-react"
import { updateUser, deleteUser } from "@/lib/services/adminApi"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import type { User } from "@/lib/services/adminApi"
import { EditUserDialog } from "./edit-user-dialog"

interface UserActionsProps {
  user: User
  currentUser: {
    id: number
    role: "admin" | "user" | "viewer"
    tenant_id: string
  }
  onActionComplete: () => void
}

export function UserActions({ user, currentUser, onActionComplete }: UserActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const router = useRouter()

  const handleStatusToggle = async () => {
    setDropdownOpen(false) // Close dropdown
    setIsLoading(true)
    try {
      const newStatus = user.status === "active" ? "suspended" : "active"
      await updateUser(user.id, { status: newStatus })

      toast({
        title: "User updated",
        description: `User ${user.username} has been ${newStatus === "active" ? "activated" : "suspended"}.`,
      })

      onActionComplete()
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

  const handleDeleteClick = () => {
    setDropdownOpen(false) // Close dropdown first
    setShowDeleteDialog(true)
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      await deleteUser(user.id)

      toast({
        title: "User deleted",
        description: `User ${user.username} has been deleted.`,
      })

      onActionComplete()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete user",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
      setShowDeleteDialog(false)
    }
  }

  const handleDeleteDialogChange = (open: boolean) => {
    setShowDeleteDialog(open)
    // Don't automatically reopen dropdown when dialog closes
  }

  // Check if current user can modify this user
  const canModify =
    currentUser.role === "admin" || (currentUser.role === "user" && user.tenant_id === currentUser.tenant_id)

  if (!canModify) {
    return null
  }

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <EditUserDialog user={user} currentUser={currentUser}>
            <DropdownMenuItem
              onSelect={(e) => {
                e.preventDefault()
                // setDropdownOpen(false)
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit user
            </DropdownMenuItem>
          </EditUserDialog>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleStatusToggle} disabled={isLoading}>
            {user.status === "active" ? (
              <>
                <UserX className="mr-2 h-4 w-4" />
                Suspend user
              </>
            ) : (
              <>
                <UserCheck className="mr-2 h-4 w-4" />
                Activate user
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-600" onClick={handleDeleteClick} disabled={isLoading}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete user
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={handleDeleteDialogChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account for{" "}
              <strong>{user.username}</strong> and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isLoading} className="bg-red-600 hover:bg-red-700">
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}