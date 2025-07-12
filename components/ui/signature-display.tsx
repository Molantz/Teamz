"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FileText, Download, Eye, Calendar, User } from 'lucide-react'
import { toast } from 'sonner'

interface SignatureDisplayProps {
  signatureData?: string
  employeeName?: string
  signedDate?: string
  signedBy?: string
  className?: string
  showDetails?: boolean
  onDownload?: () => void
  onView?: () => void
}

export function SignatureDisplay({
  signatureData,
  employeeName,
  signedDate,
  signedBy,
  className = '',
  showDetails = true,
  onDownload,
  onView
}: SignatureDisplayProps) {
  const handleDownload = () => {
    if (signatureData) {
      try {
        const link = document.createElement('a')
        link.download = `signature_${employeeName || 'employee'}_${new Date().toISOString().split('T')[0]}.png`
        link.href = signatureData
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        toast.success('Signature downloaded')
        onDownload?.()
      } catch (error) {
        console.error('Failed to download signature:', error)
        toast.error('Failed to download signature')
      }
    } else {
      toast.error('No signature to download')
    }
  }

  const handleView = () => {
    if (signatureData) {
      // Open signature in new window for full view
      const newWindow = window.open('', '_blank')
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>Signature - ${employeeName || 'Employee'}</title>
              <style>
                body { 
                  margin: 0; 
                  padding: 20px; 
                  font-family: Arial, sans-serif;
                  background: #f5f5f5;
                }
                .signature-container {
                  background: white;
                  padding: 40px;
                  border-radius: 8px;
                  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                  max-width: 600px;
                  margin: 0 auto;
                }
                .signature-image {
                  border: 1px solid #e5e7eb;
                  border-radius: 4px;
                  max-width: 100%;
                  height: auto;
                }
                .signature-info {
                  margin-top: 20px;
                  padding-top: 20px;
                  border-top: 1px solid #e5e7eb;
                }
                .signature-info h3 {
                  margin: 0 0 10px 0;
                  color: #374151;
                }
                .signature-info p {
                  margin: 5px 0;
                  color: #6b7280;
                }
              </style>
            </head>
            <body>
              <div class="signature-container">
                <h2>Digital Signature</h2>
                <img src="${signatureData}" alt="Signature" class="signature-image" />
                <div class="signature-info">
                  <h3>Signature Details</h3>
                  <p><strong>Employee:</strong> ${employeeName || 'N/A'}</p>
                  <p><strong>Signed By:</strong> ${signedBy || 'N/A'}</p>
                  <p><strong>Date:</strong> ${signedDate || 'N/A'}</p>
                </div>
              </div>
            </body>
          </html>
        `)
        newWindow.document.close()
      }
      onView?.()
    } else {
      toast.error('No signature to view')
    }
  }

  if (!signatureData) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Digital Signature
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-500">No signature available</p>
            <p className="text-sm text-gray-400">Signature has not been captured yet</p>
          </div>
        </CardContent>
      </Card>
    )
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
        <div className="border border-gray-200 rounded-lg p-4 bg-white">
          <img
            src={signatureData}
            alt="Digital Signature"
            className="max-w-full h-auto border border-gray-300 rounded"
            style={{ maxHeight: '150px' }}
          />
        </div>

        {showDetails && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Employee</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {employeeName || 'N/A'}
              </span>
            </div>

            {signedBy && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Signed By</span>
                </div>
                <span className="text-sm text-muted-foreground">{signedBy}</span>
              </div>
            )}

            {signedDate && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Signed Date</span>
                </div>
                <span className="text-sm text-muted-foreground">{signedDate}</span>
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Status</span>
              </div>
              <Badge variant="default" className="bg-green-100 text-green-800">
                Valid
              </Badge>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleView}
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            View Full Size
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            className="flex-1"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default SignatureDisplay 