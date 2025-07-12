'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, X, Calendar, User, Building2, Package, Clock, CheckCircle, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { format } from 'date-fns'

interface SearchFilter {
  field: string
  operator: 'equals' | 'contains' | 'greater_than' | 'less_than' | 'in' | 'not_in' | 'between' | 'is_null' | 'is_not_null'
  value: any
  label: string
}

interface AdvancedSearchFiltersProps {
  module: 'users' | 'devices' | 'incidents' | 'requests' | 'projects' | 'inventory' | 'departments'
  onFiltersChange: (filters: SearchFilter[]) => void
  onSearch: (query: string) => void
  onClear: () => void
  savedFilters?: SearchFilter[]
}

export function AdvancedSearchFilters({ 
  module, 
  onFiltersChange, 
  onSearch, 
  onClear, 
  savedFilters = [] 
}: AdvancedSearchFiltersProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilter[]>([])
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [isSavedFiltersOpen, setIsSavedFiltersOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [activeTab, setActiveTab] = useState('basic')

  // Module-specific filter options
  const getFilterOptions = () => {
    switch (module) {
      case 'users':
        return {
          fields: [
            { value: 'name', label: 'Name', type: 'text' },
            { value: 'email', label: 'Email', type: 'text' },
            { value: 'department', label: 'Department', type: 'select' },
            { value: 'role', label: 'Role', type: 'select' },
            { value: 'status', label: 'Status', type: 'select' },
            { value: 'join_date', label: 'Join Date', type: 'date' }
          ],
          operators: [
            { value: 'equals', label: 'Equals' },
            { value: 'contains', label: 'Contains' },
            { value: 'in', label: 'In' },
            { value: 'not_in', label: 'Not In' }
          ],
          values: {
            department: ['IT', 'HR', 'Finance', 'Sales', 'Marketing', 'Operations'],
            role: ['Admin', 'Manager', 'Technician', 'Developer', 'User'],
            status: ['Active', 'Inactive', 'Suspended']
          }
        }
      case 'devices':
        return {
          fields: [
            { value: 'name', label: 'Device Name', type: 'text' },
            { value: 'type', label: 'Type', type: 'select' },
            { value: 'status', label: 'Status', type: 'select' },
            { value: 'assigned_to', label: 'Assigned To', type: 'text' },
            { value: 'location', label: 'Location', type: 'text' },
            { value: 'purchase_date', label: 'Purchase Date', type: 'date' }
          ],
          operators: [
            { value: 'equals', label: 'Equals' },
            { value: 'contains', label: 'Contains' },
            { value: 'in', label: 'In' },
            { value: 'is_null', label: 'Is Empty' },
            { value: 'is_not_null', label: 'Is Not Empty' }
          ],
          values: {
            type: ['Laptop', 'Desktop', 'Mobile', 'Printer', 'Server', 'Network'],
            status: ['Available', 'Assigned', 'Maintenance', 'Retired']
          }
        }
      case 'incidents':
        return {
          fields: [
            { value: 'title', label: 'Title', type: 'text' },
            { value: 'priority', label: 'Priority', type: 'select' },
            { value: 'status', label: 'Status', type: 'select' },
            { value: 'category', label: 'Category', type: 'select' },
            { value: 'assigned_to', label: 'Assigned To', type: 'text' },
            { value: 'created_date', label: 'Created Date', type: 'date' }
          ],
          operators: [
            { value: 'equals', label: 'Equals' },
            { value: 'contains', label: 'Contains' },
            { value: 'in', label: 'In' },
            { value: 'between', label: 'Between' }
          ],
          values: {
            priority: ['Low', 'Medium', 'High', 'Critical'],
            status: ['New', 'In Progress', 'Resolved', 'Closed'],
            category: ['Hardware', 'Software', 'Network', 'Access', 'Other']
          }
        }
      case 'requests':
        return {
          fields: [
            { value: 'title', label: 'Title', type: 'text' },
            { value: 'type', label: 'Type', type: 'select' },
            { value: 'status', label: 'Status', type: 'select' },
            { value: 'priority', label: 'Priority', type: 'select' },
            { value: 'requester', label: 'Requester', type: 'text' },
            { value: 'created_date', label: 'Created Date', type: 'date' }
          ],
          operators: [
            { value: 'equals', label: 'Equals' },
            { value: 'contains', label: 'Contains' },
            { value: 'in', label: 'In' },
            { value: 'between', label: 'Between' }
          ],
          values: {
            type: ['Hardware', 'Software', 'Access', 'Service', 'Training'],
            status: ['Pending', 'Approved', 'Rejected', 'In Progress', 'Completed'],
            priority: ['Low', 'Medium', 'High', 'Urgent']
          }
        }
      default:
        return {
          fields: [],
          operators: [],
          values: {}
        }
    }
  }

  const filterOptions = getFilterOptions()

  const handleAddFilter = () => {
    const newFilter: SearchFilter = {
      field: '',
      operator: 'equals',
      value: '',
      label: ''
    }
    setFilters([...filters, newFilter])
  }

  const handleUpdateFilter = (index: number, field: keyof SearchFilter, value: any) => {
    const updatedFilters = [...filters]
    updatedFilters[index] = { ...updatedFilters[index], [field]: value }
    setFilters(updatedFilters)
  }

  const handleRemoveFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index))
  }

  const handleApplyFilters = () => {
    onFiltersChange(filters)
    setIsAdvancedOpen(false)
    toast.success(`${filters.length} filters applied`)
  }

  const handleClearFilters = () => {
    setFilters([])
    setSearchQuery('')
    onClear()
    toast.success('All filters cleared')
  }

  const handleSearch = () => {
    onSearch(searchQuery)
  }

  const getActiveFiltersCount = () => {
    return filters.length + (searchQuery ? 1 : 0)
  }

  const renderFilterValue = (filter: SearchFilter, index: number) => {
    const field = filterOptions.fields.find(f => f.value === filter.field)
    const values = filterOptions.values[filter.field as keyof typeof filterOptions.values] || []

    if (field?.type === 'select') {
      return (
        <Select 
          value={filter.value} 
          onValueChange={(value) => handleUpdateFilter(index, 'value', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            {values.map((value: string) => (
              <SelectItem key={value} value={value}>
                {value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )
    }

    if (field?.type === 'date') {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <Calendar className="mr-2 h-4 w-4" />
              {filter.value ? format(new Date(filter.value), 'PPP') : 'Select date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <CalendarComponent
              mode="single"
              selected={filter.value ? new Date(filter.value) : undefined}
              onSelect={(date) => handleUpdateFilter(index, 'value', date)}
            />
          </PopoverContent>
        </Popover>
      )
    }

    return (
      <Input
        value={filter.value}
        onChange={(e) => handleUpdateFilter(index, 'value', e.target.value)}
        placeholder="Enter value"
      />
    )
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
                placeholder={`Search ${module}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10"
              />
            </div>
            
            <Button onClick={handleSearch} className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>

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

            {savedFilters.length > 0 && (
              <Button
                variant="outline"
                onClick={() => setIsSavedFiltersOpen(true)}
                className="flex items-center gap-2"
              >
                Saved Filters
              </Button>
            )}

            {getActiveFiltersCount() > 0 && (
              <Button
                variant="ghost"
                onClick={handleClearFilters}
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>

          {/* Active Filters Display */}
          {getActiveFiltersCount() > 0 && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-gray-500">Active filters:</span>
              {searchQuery && (
                <Badge variant="outline" className="text-xs">
                  Search: "{searchQuery}"
                </Badge>
              )}
              {filters.map((filter, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {filter.label}: {filter.value}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFilter(index)}
                    className="ml-1 h-3 w-3 p-0"
                  >
                    <X className="h-2 w-2" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced Filters Dialog */}
      <Dialog open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Advanced Filters - {module.charAt(0).toUpperCase() + module.slice(1)}
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Basic Filters</TabsTrigger>
              <TabsTrigger value="advanced">Advanced Filters</TabsTrigger>
              <TabsTrigger value="saved">Saved Filters</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filterOptions.fields.slice(0, 6).map((field) => (
                  <div key={field.value} className="space-y-2">
                    <Label>{field.label}</Label>
                    {field.type === 'select' ? (
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${field.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {filterOptions.values[field.value as keyof typeof filterOptions.values]?.map((value: string) => (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input placeholder={`Enter ${field.label}`} />
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="space-y-4">
                {filters.map((filter, index) => (
                  <Card key={index}>
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label>Field</Label>
                          <Select 
                            value={filter.field} 
                            onValueChange={(value) => {
                              const field = filterOptions.fields.find(f => f.value === value)
                              handleUpdateFilter(index, 'field', value)
                              handleUpdateFilter(index, 'label', field?.label || '')
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select field" />
                            </SelectTrigger>
                            <SelectContent>
                              {filterOptions.fields.map((field) => (
                                <SelectItem key={field.value} value={field.value}>
                                  {field.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Operator</Label>
                          <Select 
                            value={filter.operator} 
                            onValueChange={(value) => handleUpdateFilter(index, 'operator', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {filterOptions.operators.map((op) => (
                                <SelectItem key={op.value} value={op.value}>
                                  {op.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="md:col-span-2">
                          <Label>Value</Label>
                          {renderFilterValue(filter, index)}
                        </div>
                      </div>

                      <div className="flex items-center justify-end mt-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveFilter(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button onClick={handleAddFilter} className="w-full">
                  Add Filter
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="saved" className="space-y-4">
              <div className="text-center text-gray-500 py-8">
                <Filter className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No saved filters yet</p>
                <p className="text-sm">Save frequently used filter combinations for quick access</p>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex items-center justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsAdvancedOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApplyFilters}>
              Apply Filters
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 