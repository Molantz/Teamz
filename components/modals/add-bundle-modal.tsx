"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Checkbox } from "@/components/ui/checkbox"
import { Smartphone, Wifi, Globe, Users } from "lucide-react"

const bundleSchema = z.object({
  name: z.string().min(1, "Bundle name is required"),
  type: z.string().min(1, "Bundle type is required"),
  provider: z.string().min(1, "Provider is required"),
  dataLimit: z.string().min(1, "Data limit is required"),
  voiceMinutes: z.number().min(0, "Voice minutes must be 0 or more"),
  validity: z.string().min(1, "Validity period is required"),
  cost: z.string().min(1, "Cost is required"),
  assignedTo: z.string().min(1, "Assigned user is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  expiryDate: z.string().min(1, "Expiry date is required"),
  autoRenew: z.boolean().default(true),
  description: z.string().optional(),
  internationalRoaming: z.boolean().default(false),
  smsLimit: z.number().optional(),
  mmsLimit: z.number().optional(),
})

type BundleFormData = z.infer<typeof bundleSchema>

interface AddBundleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: BundleFormData) => void
}

const bundleTypes = [
  { value: "Data Only", label: "Data Only", icon: Wifi },
  { value: "Voice + Data", label: "Voice + Data", icon: Smartphone },
  { value: "Unlimited", label: "Unlimited", icon: Globe },
  { value: "International", label: "International", icon: Globe },
]

const providers = [
  "MTN",
  "Airtel",
  "Glo",
  "9mobile",
  "Smile",
  "Spectranet",
]

const dataLimits = [
  "1GB",
  "2GB",
  "5GB",
  "10GB",
  "15GB",
  "20GB",
  "50GB",
  "100GB",
  "Unlimited",
]

const validityPeriods = [
  "7 days",
  "15 days",
  "30 days",
  "60 days",
  "90 days",
  "365 days",
]

const users = [
  "John Smith",
  "Sarah Johnson",
  "Mike Wilson",
  "Lisa Brown",
  "Tom Davis",
  "Emma Wilson",
  "David Miller",
  "Anna Garcia",
]

export function AddBundleModal({ open, onOpenChange, onSubmit }: AddBundleModalProps) {
  const [selectedType, setSelectedType] = useState<string>("")
  
  const form = useForm<BundleFormData>({
    resolver: zodResolver(bundleSchema),
    defaultValues: {
      name: "",
      type: "",
      provider: "",
      dataLimit: "",
      voiceMinutes: 0,
      validity: "",
      cost: "",
      assignedTo: "",
      phoneNumber: "",
      expiryDate: "",
      autoRenew: true,
      description: "",
      internationalRoaming: false,
      smsLimit: 0,
      mmsLimit: 0,
    },
  })

  const handleTypeChange = (type: string) => {
    setSelectedType(type)
    form.setValue("type", type)
    
    // Set default values based on type
    if (type === "Unlimited") {
      form.setValue("dataLimit", "Unlimited")
      form.setValue("voiceMinutes", 999999)
    } else if (type === "Data Only") {
      form.setValue("voiceMinutes", 0)
    }
  }

  const handleSubmit = (data: BundleFormData) => {
    onSubmit(data)
    form.reset()
    setSelectedType("")
    onOpenChange(false)
  }

  const isUnlimited = selectedType === "Unlimited"
  const isInternational = selectedType === "International"
  const isDataOnly = selectedType === "Data Only"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Airtime Bundle</DialogTitle>
          <DialogDescription>
            Create a new airtime bundle for mobile data and voice services.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bundle Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Corporate Data Plan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bundle Type</FormLabel>
                    <Select onValueChange={handleTypeChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select bundle type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {bundleTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <type.icon className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provider</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {providers.map((provider) => (
                          <SelectItem key={provider} value={provider}>
                            {provider}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monthly Cost</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., $25/month" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="dataLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data Limit</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isUnlimited}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select data limit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {dataLimits.map((limit) => (
                          <SelectItem key={limit} value={limit}>
                            {limit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="voiceMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Voice Minutes</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        disabled={isDataOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="validity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Validity Period</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select validity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {validityPeriods.map((period) => (
                          <SelectItem key={period} value={period}>
                            {period}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="assignedTo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned To</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select user" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user} value={user}>
                            {user}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+2348012345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="expiryDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiry Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter bundle description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional features for international bundles */}
            {isInternational && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="internationalRoaming"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>International Roaming</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Enable international roaming features
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* SMS and MMS limits */}
            {!isDataOnly && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="smsLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>SMS Limit</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="mmsLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>MMS Limit</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="0" 
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <FormField
              control={form.control}
              name="autoRenew"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Auto-renew</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Automatically renew this bundle when it expires
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Add Bundle
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
} 