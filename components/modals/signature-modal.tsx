"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { SignaturePad } from "@/components/ui/signature-pad"
import { useState } from "react"
import { toast } from "sonner"

interface SignatureModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (signatureData: string) => void
  title?: string
  description?: string
  employeeName?: string
  initialSignature?: string
}

export function SignatureModal({
  open,
  onOpenChange,
  onSave,
  title = "Digital Signature",
  description = "Capture your digital signature using the signature pad below",
  employeeName,
  initialSignature
}: SignatureModalProps) {
  const [signatureData, setSignatureData] = useState<string | undefined>(initialSignature)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (!signatureData) {
      toast.error('Please sign before saving')
      return
    }

    setIsLoading(true)
    try {
      onSave?.(signatureData)
      toast.success('Signature saved successfully')
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to save signature:', error)
      toast.error('Failed to save signature')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClear = () => {
    setSignatureData(undefined)
  }

  const handleSignatureSave = (data: string) => {
    setSignatureData(data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {title}
          </DialogTitle>
          <DialogDescription>
            {description}
            {employeeName && (
              <span className="block mt-1 font-medium">
                Employee: {employeeName}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <SignaturePad
            onSave={handleSignatureSave}
            onClear={handleClear}
            initialSignature={initialSignature}
            width={500}
            height={200}
            className="border-0 shadow-none"
          />

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!signatureData || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Saving...' : 'Save Signature'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SignatureModal 