'use client'

import { useState, useEffect } from 'react'
import { 
  FileText, 
  MessageSquare, 
  Paperclip, 
  Package, 
  User, 
  Building2, 
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Download,
  Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { getPRDetails, getPRAuditTrail } from '@/lib/api'
import type { PRDetails, PRStatus, AssignmentAction } from '@/lib/types'

interface DetailedPRViewProps {
  prId: string
  isOpen: boolean
  onClose: () => void
}

export function DetailedPRView({ prId, isOpen, onClose }: DetailedPRViewProps) {
  const [prDetails, setPrDetails] = useState<PRDetails | null>(null)
  const [auditTrail, setAuditTrail] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (isOpen && prId) {
      loadPRDetails()
    }
  }, [isOpen, prId])

  const loadPRDetails = async () => {
    setIsLoading(true)
    try {
      const [details, trail] = await Promise.all([
        getPRDetails(prId),
        getPRAuditTrail(prId)
      ])
      setPrDetails(details)
      setAuditTrail(trail)
    } catch (error) {
      console.error('Failed to load PR details:', error)
      toast.error('Failed to load PR details')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: PRStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'approved':
        return 'bg-blue-100 text-blue-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-800'
      case 'in_progress':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-indigo-100 text-indigo-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getAssignmentTypeIcon = (actionType: string) => {
    switch (actionType) {
      case 'assign_to_inventory':
        return <Package className="h-4 w-4" />
      case 'assign_to_user':
        return <User className="h-4 w-4" />
      case 'assign_to_department':
        return <Building2 className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl max-h-[90vh]">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading PR details...</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!prDetails) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">PR Not Found</h3>
            <p className="text-gray-600">The requested PR could not be found.</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              PR #{prDetails.pr_number} - {prDetails.title}
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(prDetails.status)}>
                {prDetails.status.replace(/_/g, ' ')}
              </Badge>
              <Badge className={getPriorityColor(prDetails.priority)}>
                {prDetails.priority}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="attachments">Attachments</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>PR Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">PR Number:</span>
                    <span>{prDetails.pr_number}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Title:</span>
                    <span>{prDetails.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Description:</span>
                    <span className="text-right max-w-xs">{prDetails.description}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total Amount:</span>
                    <span>${prDetails.total_amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Created:</span>
                    <span>{format(new Date(prDetails.created_at), 'PPP')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Updated:</span>
                    <span>{format(new Date(prDetails.updated_at), 'PPP')}</span>
                  </div>
                  {prDetails.due_date && (
                    <div className="flex justify-between">
                      <span className="font-medium">Due Date:</span>
                      <span>{format(new Date(prDetails.due_date), 'PPP')}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>People & Assignment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="font-medium">Requester:</span>
                    <span>{prDetails.requester_name}</span>
                  </div>
                  {prDetails.assigned_to && (
                    <div className="flex justify-between">
                      <span className="font-medium">Assigned To:</span>
                      <span>{prDetails.assigned_to}</span>
                    </div>
                  )}
                  {prDetails.department_id && (
                    <div className="flex justify-between">
                      <span className="font-medium">Department:</span>
                      <span>{prDetails.department_id}</span>
                    </div>
                  )}
                  {prDetails.notes && (
                    <div className="flex justify-between">
                      <span className="font-medium">Notes:</span>
                      <span className="text-right max-w-xs">{prDetails.notes}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Items Tab */}
          <TabsContent value="items" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>PR Items ({prDetails.items.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prDetails.items.map((item) => (
                    <div key={item.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{item.name}</h4>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(item.status)}>
                            {item.status.replace(/_/g, ' ')}
                          </Badge>
                          <Badge variant="outline">
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Quantity:</span> {item.quantity}
                        </div>
                        <div>
                          <span className="font-medium">Unit Price:</span> ${item.unit_price}
                        </div>
                        <div>
                          <span className="font-medium">Total Price:</span> ${item.total_price}
                        </div>
                        <div>
                          <span className="font-medium">Description:</span> {item.description}
                        </div>
                      </div>
                      {item.delivered_at && (
                        <div className="mt-2 text-sm text-gray-600">
                          Delivered: {format(new Date(item.delivered_at), 'PPP')}
                        </div>
                      )}
                      {item.assigned_at && (
                        <div className="mt-2 text-sm text-gray-600">
                          Assigned: {format(new Date(item.assigned_at), 'PPP')}
                        </div>
                      )}
                      {item.notes && (
                        <div className="mt-2 text-sm text-gray-600">
                          Notes: {item.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Status History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prDetails.status_history.map((history, index) => (
                    <div key={history.id} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        {index < prDetails.status_history.length - 1 && (
                          <div className="w-0.5 h-8 bg-gray-300 mt-1"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <Badge className={getStatusColor(history.status)}>
                            {history.status.replace(/_/g, ' ')}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {format(new Date(history.changed_at), 'PPP')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Changed by: {history.changed_by}
                        </p>
                        {history.remarks && (
                          <p className="text-sm text-gray-600 mt-1">
                            Remarks: {history.remarks}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {prDetails.approvals.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Approvals</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {prDetails.approvals.map((approval) => (
                      <div key={approval.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{approval.approver_name}</p>
                          <p className="text-sm text-gray-600">
                            {format(new Date(approval.approved_at), 'PPP')}
                          </p>
                        </div>
                        <Badge className={approval.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                          {approval.status}
                        </Badge>
                        {approval.remarks && (
                          <p className="text-sm text-gray-600 mt-1">
                            {approval.remarks}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Comments Tab */}
          <TabsContent value="comments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Comments ({prDetails.comments.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prDetails.comments.map((comment) => (
                    <div key={comment.id} className="flex gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{comment.user_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{comment.user_name}</span>
                          <span className="text-sm text-gray-500">
                            {format(new Date(comment.created_at), 'PPP')}
                          </span>
                        </div>
                        <p className="text-sm">{comment.comment}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Attachments Tab */}
          <TabsContent value="attachments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Attachments ({prDetails.attachments.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {prDetails.attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Paperclip className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">{attachment.filename}</p>
                          <p className="text-sm text-gray-600">
                            {(attachment.file_size / 1024).toFixed(1)} KB • 
                            Uploaded by {attachment.uploaded_by} on {format(new Date(attachment.uploaded_at), 'PPP')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Actions ({prDetails.assignment_actions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prDetails.assignment_actions.map((action) => (
                    <div key={action.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getAssignmentTypeIcon(action.action_type)}
                          <span className="font-medium">
                            {action.action_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                        <Badge className={action.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {action.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Target ID:</span> {action.target_id}
                        </div>
                        <div>
                          <span className="font-medium">Assigned By:</span> {action.assigned_by}
                        </div>
                        <div>
                          <span className="font-medium">Assigned At:</span> {format(new Date(action.assigned_at), 'PPP')}
                        </div>
                        <div>
                          <span className="font-medium">Status:</span> {action.status}
                        </div>
                      </div>
                      {action.notes && (
                        <div className="mt-2 text-sm text-gray-600">
                          Notes: {action.notes}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 