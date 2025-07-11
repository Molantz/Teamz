"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { 
  Trash2, 
  Download, 
  MoreHorizontal, 
  CheckCircle, 
  XCircle,
  UserCheck,
  UserX,
  Mail
} from "lucide-react"
import { toast } from "sonner"

interface BulkActionsProps {
  selectedItems: string[]
  totalItems: number
  onSelectAll: (checked: boolean) => void
  onBulkDelete: () => void
  onBulkExport: () => void
  onBulkStatusUpdate: (status: string) => void
  onBulkEmail: () => void
  entityType: string
}

export function BulkActions({
  selectedItems,
  totalItems,
  onSelectAll,
  onBulkDelete,
  onBulkExport,
  onBulkStatusUpdate,
  onBulkEmail,
  entityType
}: BulkActionsProps) {
  const [isSelectAll, setIsSelectAll] = useState(false)

  const handleSelectAll = (checked: boolean) => {
    setIsSelectAll(checked)
    onSelectAll(checked)
  }

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) {
      toast.error("No items selected")
      return
    }
    
    toast.success(`Deleted ${selectedItems.length} ${entityType}`)
    onBulkDelete()
  }

  const handleBulkExport = () => {
    if (selectedItems.length === 0) {
      toast.error("No items selected")
      return
    }
    
    toast.success(`Exported ${selectedItems.length} ${entityType}`)
    onBulkExport()
  }

  const handleBulkStatusUpdate = (status: string) => {
    if (selectedItems.length === 0) {
      toast.error("No items selected")
      return
    }
    
    toast.success(`Updated ${selectedItems.length} ${entityType} to ${status}`)
    onBulkStatusUpdate(status)
  }

  const handleBulkEmail = () => {
    if (selectedItems.length === 0) {
      toast.error("No items selected")
      return
    }
    
    toast.success(`Sent email to ${selectedItems.length} ${entityType}`)
    onBulkEmail()
  }

  if (selectedItems.length === 0) {
    return (
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={isSelectAll}
          onCheckedChange={handleSelectAll}
        />
        <span className="text-sm text-muted-foreground">
          Select all {totalItems} {entityType}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={isSelectAll}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm font-medium">
            {selectedItems.length} of {totalItems} {entityType} selected
          </span>
        </div>
        
        <Badge variant="secondary">
          {selectedItems.length} selected
        </Badge>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleBulkEmail}
          className="flex items-center space-x-1"
        >
          <Mail className="h-4 w-4" />
          <span>Email</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <MoreHorizontal className="h-4 w-4 mr-1" />
              Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleBulkExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Selected
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBulkStatusUpdate("active")}>
              <UserCheck className="h-4 w-4 mr-2" />
              Activate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBulkStatusUpdate("inactive")}>
              <UserX className="h-4 w-4 mr-2" />
              Deactivate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBulkStatusUpdate("pending")}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Pending
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleBulkStatusUpdate("completed")}>
              <XCircle className="h-4 w-4 mr-2" />
              Mark Completed
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="destructive"
          size="sm"
          onClick={handleBulkDelete}
          className="flex items-center space-x-1"
        >
          <Trash2 className="h-4 w-4" />
          <span>Delete</span>
        </Button>
      </div>
    </div>
  )
} 