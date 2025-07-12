'use client'

import { useState, useEffect } from 'react'
import { Plus, Eye, Package, Bell, Shield, Filter, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { format } from 'date-fns'

// Import existing components
import { CreatePRModal } from '@/components/modals/create-pr-modal'
import { UpdatePRStatusModal } from '@/components/modals/update-pr-status-modal'

// Import new components
import { AssignmentActionsModal } from '@/components/modals/assignment-actions-modal'
import { NotificationSystem } from '@/components/notification-system'
import { EnhancedPRSearch } from '@/components/enhanced-pr-search'
import { DetailedPRView } from '@/components/detailed-pr-view'
import { RolePermissions } from '@/components/role-permissions'

// Import API functions
import { 
  getAllPRs, 
  getPRItems, 
  getInventoryItems, 
  getAllUsers, 
  getAllDepartments,
  exportPurchaseRequests,
  searchPurchaseRequests
} from '@/lib/api'
import type { 
  PurchaseRequest, 
  PRItem, 
  InventoryItem, 
  User, 
  Department,
  PRSearchFilters,
  ExportOptions
} from '@/lib/types'

// Mock current user - in real app, this would come from auth context
const mockCurrentUser: User = {
  id: '1',
  name: 'Info & Data Analyst Officer',
  email: 'analyst@company.com',
  role: 'Info & Data Analyst Officer',
  department: 'IT',
  status: 'Active',
  joinDate: '2023-01-01'
}

export default function PurchaseRequestsPage() {
  const [prs, setPRs] = useState<PurchaseRequest[]>([])
  const [filteredPRs, setFilteredPRs] = useState<PurchaseRequest[]>([])
  const [prItems, setPRItems] = useState<PRItem[]>([])
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false)
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false)
  const [isDetailedViewOpen, setIsDetailedViewOpen] = useState(false)
  
  // Selected items
  const [selectedPR, setSelectedPR] = useState<PurchaseRequest | null>(null)
  const [selectedPRItem, setSelectedPRItem] = useState<PRItem | null>(null)
  const [selectedPRForDetails, setSelectedPRForDetails] = useState<string>('')

  // Search and filters
  const [searchFilters, setSearchFilters] = useState<PRSearchFilters>({})

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [prsData, inventoryData, usersData, departmentsData] = await Promise.all([
        getAllPRs(),
        getInventoryItems(),
        getAllUsers(),
        getAllDepartments()
      ])
      
      setPRs(prsData)
      setFilteredPRs(prsData)
      setInventoryItems(inventoryData)
      setUsers(usersData)
      setDepartments(departmentsData)
    } catch (error) {
      console.error('Failed to load data:', error)
      toast.error('Failed to load data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePR = async (prData: Partial<PurchaseRequest>) => {
    try {
      // Create PR logic here
      toast.success('PR created successfully')
      setIsCreateModalOpen(false)
      await loadData()
    } catch (error) {
      console.error('Failed to create PR:', error)
      toast.error('Failed to create PR')
    }
  }

  const handleUpdateStatus = async (prId: string, newStatus: string, remarks?: string) => {
    try {
      // Update status logic here
      toast.success('PR status updated successfully')
      setIsStatusModalOpen(false)
      await loadData()
    } catch (error) {
      console.error('Failed to update PR status:', error)
      toast.error('Failed to update PR status')
    }
  }

  const handleAssignmentAction = async (prItemId: string, actionType: string, targetId: string, notes?: string) => {
    try {
      // Assignment action logic here
      toast.success('Item assigned successfully')
      setIsAssignmentModalOpen(false)
      await loadData()
    } catch (error) {
      console.error('Failed to assign item:', error)
      toast.error('Failed to assign item')
    }
  }

  const handleSearchFiltersChange = async (filters: PRSearchFilters) => {
    setSearchFilters(filters)
    try {
      const filtered = await searchPurchaseRequests(filters)
      setFilteredPRs(filtered)
    } catch (error) {
      console.error('Failed to apply filters:', error)
      toast.error('Failed to apply filters')
    }
  }

  const handleExport = async (options: ExportOptions) => {
    try {
      const blob = await exportPurchaseRequests(options)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `purchase-requests-${format(new Date(), 'yyyy-MM-dd')}.${options.format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Export failed')
    }
  }

  const handleNotificationClick = (notification: any) => {
    // Handle notification click - could navigate to specific PR
    console.log('Notification clicked:', notification)
  }

  const getStatusColor = (status: string) => {
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading purchase requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Purchase Requests</h1>
          <p className="text-gray-600">Manage and track purchase requests</p>
        </div>
        <div className="flex items-center gap-2">
          <NotificationSystem 
            currentUser={mockCurrentUser}
            onNotificationClick={handleNotificationClick}
          />
          <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create PR
          </Button>
        </div>
      </div>

      {/* Enhanced Search and Filters */}
      <EnhancedPRSearch
        onFiltersChange={handleSearchFiltersChange}
        onExport={handleExport}
        users={users}
        departments={departments}
      />

      {/* Dashboard Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total PRs</p>
                <p className="text-2xl font-bold">{filteredPRs.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approval</p>
                <p className="text-2xl font-bold">
                  {filteredPRs.filter(pr => pr.status === 'pending_approval').length}
                </p>
              </div>
              <Bell className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold">
                  {filteredPRs.filter(pr => pr.status === 'approved').length}
                </p>
              </div>
              <Shield className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivered</p>
                <p className="text-2xl font-bold">
                  {filteredPRs.filter(pr => pr.status === 'delivered').length}
                </p>
              </div>
              <Package className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PR List */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Requests ({filteredPRs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPRs.map((pr) => (
              <div key={pr.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium">PR #{pr.pr_number}</h3>
                    <Badge className={getStatusColor(pr.status)}>
                      {pr.status.replace(/_/g, ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(pr.priority)}>
                      {pr.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPRForDetails(pr.id)
                        setIsDetailedViewOpen(true)
                      }}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedPR(pr)
                        setIsStatusModalOpen(true)
                      }}
                    >
                      Update Status
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Title:</span> {pr.title}
                  </div>
                  <div>
                    <span className="font-medium">Requester:</span> {pr.requester_name}
                  </div>
                  <div>
                    <span className="font-medium">Amount:</span> ${pr.total_amount.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium">Created:</span> {format(new Date(pr.created_at), 'MMM dd, yyyy')}
                  </div>
                  <div>
                    <span className="font-medium">Updated:</span> {format(new Date(pr.updated_at), 'MMM dd, yyyy')}
                  </div>
                  {pr.assigned_to && (
                    <div>
                      <span className="font-medium">Assigned To:</span> {pr.assigned_to}
                    </div>
                  )}
                </div>

                {pr.description && (
                  <p className="text-sm text-gray-600 mt-2">{pr.description}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role Permissions */}
      <RolePermissions currentUser={mockCurrentUser} />

      {/* Modals */}
      <CreatePRModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePR}
        users={users}
        departments={departments}
      />

      <UpdatePRStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onSubmit={handleUpdateStatus}
        pr={selectedPR}
        currentUser={mockCurrentUser}
      />

      <AssignmentActionsModal
        isOpen={isAssignmentModalOpen}
        onClose={() => setIsAssignmentModalOpen(false)}
        prItem={selectedPRItem!}
        currentUser={mockCurrentUser}
        inventoryItems={inventoryItems}
        users={users}
        departments={departments}
      />

      <DetailedPRView
        prId={selectedPRForDetails}
        isOpen={isDetailedViewOpen}
        onClose={() => setIsDetailedViewOpen(false)}
      />
    </div>
  )
} 