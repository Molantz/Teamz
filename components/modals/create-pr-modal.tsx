"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { prApi } from "@/lib/api"
import { PurchaseRequest, PRItem } from "@/lib/supabase"

const mockUsers = [
  { id: "emp-001", name: "John Smith" },
  { id: "emp-002", name: "Sarah Johnson" },
  { id: "emp-003", name: "Mike Wilson" },
  { id: "emp-004", name: "Emily Davis" },
]
const mockDepartments = [
  { id: "dept-001", name: "IT" },
  { id: "dept-002", name: "HR" },
  { id: "dept-003", name: "Engineering" },
  { id: "dept-004", name: "Marketing" },
]
const categories = [
  "devices", "software", "service", "consumables", "equipment", "accessories"
]
const priorities = ["low", "medium", "high", "urgent"]

export function CreatePRModal({ isOpen, onClose, onSuccess }: {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}) {
  const [prNumber, setPRNumber] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [requesterId, setRequesterId] = useState("")
  const [departmentId, setDepartmentId] = useState("")
  const [assignedToId, setAssignedToId] = useState("")
  const [priority, setPriority] = useState("medium")
  const [remarks, setRemarks] = useState("")
  const [items, setItems] = useState<PRItem[]>([{
    id: "",
    pr_id: "",
    item_name: "",
    description: "",
    category: "devices",
    subcategory: "",
    quantity: 1,
    unit_price: 0,
    total_price: 0,
    supplier: "",
    model_number: "",
    specifications: {},
    status: "pending",
    delivery_status: "pending",
    inventory_item_id: undefined,
    assigned_to_employee_id: undefined,
    remarks: "",
    created_at: "",
    updated_at: ""
  }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleItemChange = (idx: number, field: keyof PRItem, value: any) => {
    setItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item))
  }
  const handleAddItem = () => {
    setItems(prev => [...prev, {
      id: "",
      pr_id: "",
      item_name: "",
      description: "",
      category: "devices",
      subcategory: "",
      quantity: 1,
      unit_price: 0,
      total_price: 0,
      supplier: "",
      model_number: "",
      specifications: {},
      status: "pending",
      delivery_status: "pending",
      inventory_item_id: undefined,
      assigned_to_employee_id: undefined,
      remarks: "",
      created_at: "",
      updated_at: ""
    }])
  }
  const handleRemoveItem = (idx: number) => {
    setItems(prev => prev.filter((_, i) => i !== idx))
  }

  const validate = () => {
    if (!prNumber.trim()) return "PR number is required"
    if (!title.trim()) return "Title is required"
    if (!requesterId) return "Requester is required"
    if (!departmentId) return "Department is required"
    if (items.length === 0) return "At least one item is required"
    for (const item of items) {
      if (!item.item_name.trim()) return "Each item must have a name"
      if (!item.category) return "Each item must have a category"
      if (!item.quantity || item.quantity < 1) return "Each item must have a valid quantity"
    }
    return null
  }

  const handleSubmit = async () => {
    setError(null)
    const err = validate()
    if (err) {
      setError(err)
      return
    }
    setLoading(true)
    try {
      // Create PR
      const pr: Partial<PurchaseRequest> = {
        pr_number: prNumber,
        title,
        description,
        requester_id: requesterId,
        department_id: departmentId,
        assigned_to_id: assignedToId,
        priority,
        remarks,
        status: "draft"
      }
      const createdPR = await prApi.createPR(pr)
      // Create items
      for (const item of items) {
        await prApi.addPRItem({
          ...item,
          pr_id: createdPR.id,
          total_price: (item.unit_price || 0) * (item.quantity || 1)
        })
      }
      onSuccess()
      onClose()
    } catch (e: any) {
      setError(e.message || "Failed to create PR")
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Create New Purchase Request</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label>PR Number *</Label>
            <Input value={prNumber} onChange={e => setPRNumber(e.target.value)} placeholder="Manual PR number" />
          </div>
          <div>
            <Label>Priority</Label>
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
              <SelectContent>
                {priorities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Requester *</Label>
            <Select value={requesterId} onValueChange={setRequesterId}>
              <SelectTrigger><SelectValue placeholder="Select requester" /></SelectTrigger>
              <SelectContent>
                {mockUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Department *</Label>
            <Select value={departmentId} onValueChange={setDepartmentId}>
              <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
              <SelectContent>
                {mockDepartments.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Assigned To</Label>
            <Select value={assignedToId} onValueChange={setAssignedToId}>
              <SelectTrigger><SelectValue placeholder="Assign to employee (optional)" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {mockUsers.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label>Title *</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="PR title" />
          </div>
          <div className="col-span-2">
            <Label>Description</Label>
            <Textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe the purpose of this PR..." rows={2} />
          </div>
          <div className="col-span-2">
            <Label>Remarks</Label>
            <Textarea value={remarks} onChange={e => setRemarks(e.target.value)} placeholder="Any additional remarks..." rows={2} />
          </div>
        </div>
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>PR Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr>
                    <th>Item Name *</th>
                    <th>Category *</th>
                    <th>Quantity *</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                    <th>Supplier</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <Input value={item.item_name} onChange={e => handleItemChange(idx, "item_name", e.target.value)} placeholder="Item name" />
                      </td>
                      <td>
                        <Select value={item.category} onValueChange={v => handleItemChange(idx, "category", v)}>
                          <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
                          <SelectContent>
                            {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </td>
                      <td>
                        <Input type="number" min={1} value={item.quantity} onChange={e => handleItemChange(idx, "quantity", Number(e.target.value))} />
                      </td>
                      <td>
                        <Input type="number" min={0} value={item.unit_price} onChange={e => handleItemChange(idx, "unit_price", Number(e.target.value))} />
                      </td>
                      <td className="text-right">${((item.unit_price || 0) * (item.quantity || 1)).toLocaleString()}</td>
                      <td>
                        <Input value={item.supplier} onChange={e => handleItemChange(idx, "supplier", e.target.value)} placeholder="Supplier" />
                      </td>
                      <td>
                        <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(idx)} disabled={items.length === 1}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-2">
                <Button variant="outline" size="sm" onClick={handleAddItem}>
                  <Plus className="h-4 w-4 mr-2" /> Add Item
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>{loading ? "Saving..." : "Save PR"}</Button>
        </div>
      </div>
    </div>
  )
} 