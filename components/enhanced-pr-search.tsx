'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, Download, Calendar as CalendarIcon, Building2, Package, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { searchPurchaseRequests, exportPurchaseRequests } from '@/lib/api'
import type { PRSearchFilters, ExportOptions, PRStatus, User, Department } from '@/lib/types'

interface EnhancedPRSearchProps {
  onFiltersChange: (filters: PRSearchFilters) => void
  onExport: (options: ExportOptions) => void
  users?: User[]
  departments?: Department[]
}

export function EnhancedPRSearch({ onFiltersChange, onExport, users = [], departments = [] }: EnhancedPRSearchProps) {
  const [filters, setFilters] = useState<PRSearchFilters>({})
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    filters: {},
    include_details: false
  })
  const [isLoading, setIsLoading] = useState(false)

  const statusOptions: PRStatus[] = [
    'draft', 'pending_approval', 'approved', 'rejected', 
    'in_progress', 'delivered', 'completed', 'cancelled'
  ]

  const categoryOptions = [
    'device', 'software', 'consumable', 'service', 'other'
  ]

  const handleFilterChange = (key: keyof PRSearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({})
    onFiltersChange({})
  }

  const handleExport = async () => {
    setIsLoading(true)
    try {
      const options = { ...exportOptions, filters }
      await onExport(options)
      setIsExportOpen(false)
      toast.success('Export completed successfully')
    } catch (error) {
      console.error('Export failed:', error)
      toast.error('Export failed')
    } finally {
      setIsLoading(false)
    }
  }

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== undefined && value !== null && 
      (Array.isArray(value) ? value.length > 0 : true)
    ).length
  }

  return (
    <>
      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by PR number, title, or requester..."
                value={filters.pr_number || ''}
                onChange={(e) => handleFilterChange('pr_number', e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Button
              variant="outline"
              onClick={() => setIsAdvancedOpen(true)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={() => setIsExportOpen(true)}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>

          {/* Quick Filters */}
          {getActiveFiltersCount() > 0 && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500">Active filters:</span>
              {filters.status && (
                <Badge variant="outline" className="text-xs">
                  Status: {Array.isArray(filters.status) ? filters.status.join(', ') : filters.status}
                </Badge>
              )}
              {filters.category && (
                <Badge variant="outline" className="text-xs">
                  Category: {Array.isArray(filters.category) ? filters.category.join(', ') : filters.category}
                </Badge>
              )}
              {filters.date_from && (
                <Badge variant="outline" className="text-xs">
                  From: {format(new Date(filters.date_from), 'MMM dd, yyyy')}
                </Badge>
              )}
              {filters.date_to && (
                <Badge variant="outline" className="text-xs">
                  To: {format(new Date(filters.date_to), 'MMM dd, yyyy')}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-xs"
              >
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced Filters Dialog */}
      <Dialog open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Advanced Filters</DialogTitle>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Filter */}
            <div className="space-y-3">
              <Label>Status</Label>
              <div className="space-y-2">
                {statusOptions.map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      id={`status-${status}`}
                      checked={Array.isArray(filters.status) && filters.status.includes(status)}
                      onCheckedChange={(checked) => {
                        const currentStatuses = Array.isArray(filters.status) ? filters.status : []
                        const newStatuses = checked
                          ? [...currentStatuses, status]
                          : currentStatuses.filter(s => s !== status)
                        handleFilterChange('status', newStatuses)
                      }}
                    />
                    <Label htmlFor={`status-${status}`} className="text-sm capitalize">
                      {status.replace(/_/g, ' ')}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <Label>Category</Label>
              <div className="space-y-2">
                {categoryOptions.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={`category-${category}`}
                      checked={Array.isArray(filters.category) && filters.category.includes(category)}
                      onCheckedChange={(checked) => {
                        const currentCategories = Array.isArray(filters.category) ? filters.category : []
                        const newCategories = checked
                          ? [...currentCategories, category]
                          : currentCategories.filter(c => c !== category)
                        handleFilterChange('category', newCategories)
                      }}
                    />
                    <Label htmlFor={`category-${category}`} className="text-sm capitalize">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-3">
              <Label>Date Range</Label>
              <div className="space-y-2">
                <div>
                  <Label htmlFor="date-from" className="text-sm">From</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.date_from ? format(new Date(filters.date_from), 'PPP') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.date_from ? new Date(filters.date_from) : undefined}
                        onSelect={(date) => handleFilterChange('date_from', date)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="date-to" className="text-sm">To</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {filters.date_to ? format(new Date(filters.date_to), 'PPP') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={filters.date_to ? new Date(filters.date_to) : undefined}
                        onSelect={(date) => handleFilterChange('date_to', date)}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </div>

            {/* Requester and Department */}
            <div className="space-y-3">
              <div>
                <Label htmlFor="requester">Requester</Label>
                <Select
                  value={filters.requester_id || ''}
                  onValueChange={(value) => handleFilterChange('requester_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select requester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All requesters</SelectItem>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="department">Department</Label>
                <Select
                  value={filters.department_id || ''}
                  onValueChange={(value) => handleFilterChange('department_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Boolean Filters */}
            <div className="space-y-3">
              <Label>Additional Filters</Label>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="has-incomplete-info"
                    checked={filters.has_incomplete_info === true}
                    onCheckedChange={(checked) => handleFilterChange('has_incomplete_info', checked)}
                  />
                  <Label htmlFor="has-incomplete-info" className="text-sm">
                    Has incomplete information
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="is-delivered"
                    checked={filters.is_delivered === true}
                    onCheckedChange={(checked) => handleFilterChange('is_delivered', checked)}
                  />
                  <Label htmlFor="is-delivered" className="text-sm">
                    Is delivered
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear All
            </Button>
            <Button onClick={() => setIsAdvancedOpen(false)}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Dialog */}
      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Purchase Requests</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="export-format">Format</Label>
              <Select
                value={exportOptions.format}
                onValueChange={(value: 'csv' | 'excel' | 'pdf') => 
                  setExportOptions(prev => ({ ...prev, format: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-details"
                checked={exportOptions.include_details}
                onCheckedChange={(checked) => 
                  setExportOptions(prev => ({ ...prev, include_details: checked === true }))
                }
              />
              <Label htmlFor="include-details">Include detailed information</Label>
            </div>

            <div className="text-sm text-gray-600">
              <p>This export will include all PRs matching the current filters.</p>
              <p>Total items to export: <strong>Calculating...</strong></p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsExportOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={isLoading}>
              {isLoading ? 'Exporting...' : 'Export'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 