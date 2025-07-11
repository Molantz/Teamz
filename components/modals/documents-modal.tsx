"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Upload, Camera, Eye, Trash2, Search, Calendar, AlertTriangle, Shield } from "lucide-react"
import { useState } from "react"

interface DocumentsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  employeeName: string
  employeeId: string
}

export function DocumentsModal({ open, onOpenChange, employeeName, employeeId }: DocumentsModalProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const documents = {
    identification: [
      {
        name: "National ID Card",
        type: "ID",
        uploadDate: "2024-01-15",
        size: "1.2 MB",
        format: "PDF",
        expiryDate: "2029-01-15",
        status: "Valid",
      },
      {
        name: "Passport",
        type: "ID",
        uploadDate: "2024-01-15",
        size: "2.1 MB",
        format: "PDF",
        expiryDate: "2026-06-20",
        status: "Expiring Soon",
      },
    ],
    contracts: [
      {
        name: "Employment Contract",
        type: "Contract",
        uploadDate: "2024-01-15",
        size: "2.3 MB",
        format: "PDF",
        expiryDate: null,
        status: "Active",
      },
      {
        name: "NDA Agreement",
        type: "Legal",
        uploadDate: "2024-01-15",
        size: "0.8 MB",
        format: "PDF",
        expiryDate: null,
        status: "Active",
      },
    ],
    photos: [
      {
        name: "Profile Photo",
        type: "Photo",
        uploadDate: "2024-01-15",
        size: "0.5 MB",
        format: "JPG",
        expiryDate: null,
        status: "Current",
      },
      {
        name: "ID Card Photo",
        type: "Photo",
        uploadDate: "2024-01-15",
        size: "0.3 MB",
        format: "PNG",
        expiryDate: null,
        status: "Current",
      },
    ],
    certificates: [
      {
        name: "IT Certification",
        type: "Certificate",
        uploadDate: "2024-01-15",
        size: "1.1 MB",
        format: "PDF",
        expiryDate: "2025-12-31",
        status: "Valid",
      },
    ],
    misc: [
      {
        name: "Emergency Contact Form",
        type: "Form",
        uploadDate: "2024-01-15",
        size: "0.4 MB",
        format: "PDF",
        expiryDate: null,
        status: "Current",
      },
    ],
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Valid":
      case "Active":
      case "Current":
        return "default"
      case "Expiring Soon":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const DocumentCard = ({ doc }: { doc: any }) => (
    <Card className="hover:bg-muted/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <FileText className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <div className="font-medium">{doc.name}</div>
              <div className="text-sm text-muted-foreground">
                {doc.format} • {doc.size} • {doc.uploadDate}
              </div>
              {doc.expiryDate && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>Expires: {doc.expiryDate}</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant={getStatusColor(doc.status)}>{doc.status}</Badge>
            <div className="flex gap-1">
              <Button variant="outline" size="sm">
                <Eye className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-3 w-3" />
              </Button>
              <Button variant="outline" size="sm">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
        {doc.status === "Expiring Soon" && (
          <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-orange-800">
              <AlertTriangle className="h-4 w-4" />
              <span>Document expires soon - renewal required</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Document Management
          </DialogTitle>
          <DialogDescription>
            View and manage documents for {employeeName} ({employeeId})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Search and Upload */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <Button variant="outline">
                <Camera className="h-4 w-4 mr-2" />
                Camera
              </Button>
            </div>
          </div>

          {/* Document Categories */}
          <Tabs defaultValue="identification" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="identification">ID Documents</TabsTrigger>
              <TabsTrigger value="contracts">Contracts</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="certificates">Certificates</TabsTrigger>
              <TabsTrigger value="misc">Miscellaneous</TabsTrigger>
            </TabsList>

            <TabsContent value="identification" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Identification Documents ({documents.identification.length})</h3>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Add ID Document
                </Button>
              </div>
              <div className="space-y-3">
                {documents.identification.map((doc, index) => (
                  <DocumentCard key={index} doc={doc} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="contracts" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Contracts & Legal Documents ({documents.contracts.length})</h3>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Add Contract
                </Button>
              </div>
              <div className="space-y-3">
                {documents.contracts.map((doc, index) => (
                  <DocumentCard key={index} doc={doc} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="photos" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Photos & Images ({documents.photos.length})</h3>
                <Button variant="outline" size="sm">
                  <Camera className="h-4 w-4 mr-2" />
                  Add Photo
                </Button>
              </div>
              <div className="space-y-3">
                {documents.photos.map((doc, index) => (
                  <DocumentCard key={index} doc={doc} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="certificates" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Certificates & Qualifications ({documents.certificates.length})</h3>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Add Certificate
                </Button>
              </div>
              <div className="space-y-3">
                {documents.certificates.map((doc, index) => (
                  <DocumentCard key={index} doc={doc} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="misc" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Miscellaneous Documents ({documents.misc.length})</h3>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Add Document
                </Button>
              </div>
              <div className="space-y-3">
                {documents.misc.map((doc, index) => (
                  <DocumentCard key={index} doc={doc} />
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Document Upload Area */}
          <Card className="border-2 border-dashed border-muted-foreground/25">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Upload className="h-12 w-12 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-medium">Upload New Document</h4>
                  <p className="text-sm text-muted-foreground">Drag and drop files here or click to browse</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor="document-type">Document Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="id">ID Document</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="photo">Photo</SelectItem>
                        <SelectItem value="certificate">Certificate</SelectItem>
                        <SelectItem value="form">Form</SelectItem>
                        <SelectItem value="misc">Miscellaneous</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2 pt-6">
                    <Button>
                      <Upload className="h-4 w-4 mr-2" />
                      Browse Files
                    </Button>
                    <Button variant="outline">
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Document Security Notice */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-medium text-blue-900">Document Security</h4>
                  <p className="text-sm text-blue-800">
                    All documents are encrypted and stored securely. Access is logged and monitored for compliance.
                    Sensitive documents require additional approval for viewing or downloading.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
