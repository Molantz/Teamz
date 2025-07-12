"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { prApi } from "@/lib/api"

const statusOptions = [
  "draft", "submitted", "under_review", "approved", "rejected", "in_progress", "delivered", "completed", "cancelled"
]

export function UpdatePRStatusModal({
  isOpen,
  onClose,
  prId,
  currentStatus,
  onSuccess,
  officerId
}: {
  isOpen: boolean
  onClose: () => void
  prId: string
  currentStatus: string
  onSuccess: () => void
  officerId: string
}) {
  const [newStatus, setNewStatus] = useState(currentStatus)
  const [remarks, setRemarks] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async () => {
    setError(null)
    if (!newStatus) {
      setError("Status is required")
      return
    }
    setLoading(true)
    try {
      await prApi.updatePRStatus(prId, newStatus, officerId, remarks)
      // Optionally, trigger notification for certain statuses
      if (["rejected", "delivered", "completed", "cancelled"].includes(newStatus)) {
        await prApi.addPRNotification({
          pr_id: prId,
          notification_type: "status_change",
          recipient_id: officerId, // In real app, send to requester/assigned
          title: `PR Status Updated to ${newStatus}`,
          message: remarks || `Status changed to ${newStatus}`,
          is_read: false
        })
      }
      onSuccess()
      onClose()
    } catch (e: any) {
      setError(e.message || "Failed to update status")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Update PR Status</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div className="mb-4">
          <label className="block mb-1 font-medium">New Status *</label>
          <Select value={newStatus} onValueChange={setNewStatus}>
            <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
            <SelectContent>
              {statusOptions.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Remarks</label>
          <Textarea value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Enter remarks (optional)" rows={3} />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>{loading ? "Saving..." : "Update Status"}</Button>
        </div>
      </div>
    </div>
  )
} 