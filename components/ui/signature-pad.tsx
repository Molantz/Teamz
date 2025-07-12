"use client"

import React, { useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { 
  RotateCcw, 
  Save, 
  Trash2, 
  Download, 
  Upload, 
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { toast } from 'sonner'

interface SignaturePadProps {
  onSave?: (signatureData: string) => void
  onClear?: () => void
  initialSignature?: string
  width?: number
  height?: number
  penColor?: string
  backgroundColor?: string
  className?: string
}

export function SignaturePad({
  onSave,
  onClear,
  initialSignature,
  width = 400,
  height = 200,
  penColor = '#000000',
  backgroundColor = '#ffffff',
  className = ''
}: SignaturePadProps) {
  const signatureRef = useRef<SignatureCanvas>(null)
  const [isSigned, setIsSigned] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const clearSignature = () => {
    if (signatureRef.current) {
      signatureRef.current.clear()
      setIsSigned(false)
      onClear?.()
      toast.success('Signature cleared')
    }
  }

  const saveSignature = () => {
    if (signatureRef.current) {
      if (signatureRef.current.isEmpty()) {
        toast.error('Please sign before saving')
        return
      }

      setIsLoading(true)
      try {
        const signatureData = signatureRef.current.toDataURL()
        onSave?.(signatureData)
        setIsSigned(true)
        toast.success('Signature saved successfully')
      } catch (error) {
        console.error('Failed to save signature:', error)
        toast.error('Failed to save signature')
      } finally {
        setIsLoading(false)
      }
    }
  }

  const downloadSignature = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      try {
        const signatureData = signatureRef.current.toDataURL()
        const link = document.createElement('a')
        link.download = `signature_${new Date().toISOString().split('T')[0]}.png`
        link.href = signatureData
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success('Signature downloaded')
      } catch (error) {
        console.error('Failed to download signature:', error)
        toast.error('Failed to download signature')
      }
    } else {
      toast.error('No signature to download')
    }
  }

  const handleBegin = () => {
    setIsSigned(false)
  }

  const handleEnd = () => {
    if (signatureRef.current && !signatureRef.current.isEmpty()) {
      setIsSigned(true)
    }
  }

  const loadSignature = (signatureData: string) => {
    if (signatureRef.current) {
      signatureRef.current.fromDataURL(signatureData)
      setIsSigned(true)
      toast.success('Signature loaded')
    }
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Digital Signature
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Signature Pad</Label>
          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4">
            <div className="flex justify-center">
              <SignatureCanvas
                ref={signatureRef}
                canvasProps={{
                  width,
                  height,
                  className: 'border border-gray-300 rounded-lg cursor-crosshair',
                  style: {
                    backgroundColor,
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem'
                  }
                }}
                penColor={penColor}
                backgroundColor={backgroundColor}
                onBegin={handleBegin}
                onEnd={handleEnd}
              />
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isSigned ? (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Signed</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-yellow-600">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Not signed</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={clearSignature}
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={downloadSignature}
              disabled={!isSigned || isLoading}
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={saveSignature}
              disabled={!isSigned || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {isLoading ? 'Saving...' : 'Save Signature'}
            </Button>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>• Click and drag to sign</p>
          <p>• Use the Clear button to start over</p>
          <p>• Download to save locally</p>
          <p>• Save to store in the system</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default SignaturePad 