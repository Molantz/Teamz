"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { auditLogger } from "@/lib/audit-log"
import { Package, Laptop, Monitor, Printer, Server, Smartphone, Calendar, DollarSign } from "lucide-react"

interface AddAssetModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: (data: any) => void
}

const assetTypes = [
  "Laptop",
  "Desktop",
  "Monitor",
  "Printer",
  "Server",
  "Network Device",
  "Mobile Device",
  "Software License",
  "Peripheral",
  "Other"
]

const assetStatuses = [
  "Available",
  "Assigned",
  "Maintenance",
  "Retired",
  "Lost/Stolen"
]

const locations = [
  "Head Office",
  "Branch Office A",
  "Branch Office B",
  "Warehouse",
  "Remote",
  "Data Center"
]

export function AddAssetModal({ open, onOpenChange, onSubmit }: AddAssetModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    model: "",
    serialNumber: "",
    manufacturer: "",
    purchaseDate: "",
    purchasePrice: "",
    warrantyExpiry: "",
    location: "",
    status: "Available",
    assignedTo: "",
    notes: "",
    specifications: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const { assetsApi } = await import('@/lib/api')
      
      const newAsset = {
        name: formData.name,
        type: formData.type,
        model: formData.model,
        serial_number: formData.serialNumber,
        manufacturer: formData.manufacturer,
        purchase_date: formData.purchaseDate,
        purchase_price: formData.purchasePrice ? parseFloat(formData.purchasePrice) : undefined,
        warranty_expiry: formData.warrantyExpiry,
        location: formData.location,
        status: formData.status,
        assigned_to: formData.assignedTo,
        notes: formData.notes,
        specifications: formData.specifications
      }
      
      const createdAsset = await assetsApi.create(newAsset)
      
      if (onSubmit) {
        onSubmit(createdAsset)
      }
      
      toast.success(`Asset ${formData.name} added successfully`)
      
      auditLogger.logUserAction(
        'current-user',
        'Current User',
        'Created asset',
        'asset',
        createdAsset.id,
        `Created asset: ${formData.name} (${formData.type})`
      )
      
      // Reset form
      setFormData({
        name: "",
        type: "",
        model: "",
        serialNumber: "",
        manufacturer: "",
        purchaseDate: "",
        purchasePrice: "",
        warrantyExpiry: "",
        location: "",
        status: "Available",
        assignedTo: "",
        notes: "",
        specifications: ""
      })
      
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to add asset:', error)
      toast.error("Failed to add asset")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getAssetIcon = (type: string) => {
    switch (type) {
      case "Laptop":
      case "Desktop":
        return <Laptop className="h-4 w-4" />
      case "Monitor":
        return <Monitor className="h-4 w-4" />
      case "Printer":
        return <Printer className="h-4 w-4" />
      case "Server":
        return <Server className="h-4 w-4" />
      case "Mobile Device":
        return <Smartphone className="h-4 w-4" />
      default:
        return <Package className="h-4 w-4" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Add New Asset
          </DialogTitle>
          <DialogDescription>
            Register a new IT asset or equipment in the inventory system
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Asset Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Dell Latitude 5520"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Asset Type *</Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  {assetTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      <div className="flex items-center gap-2">
                        {getAssetIcon(type)}
                        {type}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
                placeholder="Latitude 5520"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input
                id="manufacturer"
                value={formData.manufacturer}
                onChange={(e) => handleInputChange("manufacturer", e.target.value)}
                placeholder="Dell Inc."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="serialNumber">Serial Number</Label>
            <Input
              id="serialNumber"
              value={formData.serialNumber}
              onChange={(e) => handleInputChange("serialNumber", e.target.value)}
              placeholder="ABC123456789"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => handleInputChange("purchaseDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Purchase Price</Label>
              <Input
                id="purchasePrice"
                type="number"
                value={formData.purchasePrice}
                onChange={(e) => handleInputChange("purchasePrice", e.target.value)}
                placeholder="0.00"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
              <Input
                id="warrantyExpiry"
                type="date"
                value={formData.warrantyExpiry}
                onChange={(e) => handleInputChange("warrantyExpiry", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Select value={formData.location} onValueChange={(value) => handleInputChange("location", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {assetStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To (Optional)</Label>
              <Input
                id="assignedTo"
                value={formData.assignedTo}
                onChange={(e) => handleInputChange("assignedTo", e.target.value)}
                placeholder="User name or email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specifications">Specifications</Label>
            <Textarea
              id="specifications"
              value={formData.specifications}
              onChange={(e) => handleInputChange("specifications", e.target.value)}
              placeholder="CPU: Intel i7, RAM: 16GB, Storage: 512GB SSD..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Additional notes about the asset..."
              rows={3}
            />
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading || !formData.name || !formData.type}>
            {isLoading ? "Adding..." : "Add Asset"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 