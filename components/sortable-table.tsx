"use client"

import { useState, useMemo } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { SearchFilter } from '@/components/search-filter'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'

interface Column {
  key: string
  label: string
  sortable?: boolean
  filterable?: boolean
  filterOptions?: { value: string; label: string }[]
  render?: (value: any, row: any) => React.ReactNode
}

interface SortableTableProps {
  data: any[]
  columns: Column[]
  searchFields?: string[]
  onRowClick?: (row: any) => void
  className?: string
}

type SortDirection = 'asc' | 'desc' | null

export function SortableTable({
  data,
  columns,
  searchFields = [],
  onRowClick,
  className = ""
}: SortableTableProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Record<string, string>>({})
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  // Create filter options from columns
  const filterOptions = useMemo(() => {
    return columns
      .filter(col => col.filterable && col.filterOptions)
      .map(col => ({
        key: col.key,
        label: col.label,
        options: col.filterOptions || []
      }))
  }, [columns])

  // Filter and sort data
  const processedData = useMemo(() => {
    let filteredData = [...data]

    // Apply search
    if (searchQuery) {
      filteredData = filteredData.filter(row =>
        searchFields.some(field => {
          const value = row[field]
          return value && value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        })
      )
    }

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        filteredData = filteredData.filter(row => {
          const cellValue = row[key]
          return cellValue && cellValue.toString() === value
        })
      }
    })

    // Apply sorting
    if (sortColumn && sortDirection) {
      filteredData.sort((a, b) => {
        const aValue = a[sortColumn]
        const bValue = b[sortColumn]

        if (aValue === bValue) return 0

        const comparison = aValue < bValue ? -1 : 1
        return sortDirection === 'asc' ? comparison : -comparison
      })
    }

    return filteredData
  }, [data, searchQuery, filters, sortColumn, sortDirection, searchFields])

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortColumn(null)
        setSortDirection(null)
      }
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }

  const getSortIcon = (columnKey: string) => {
    if (sortColumn !== columnKey) {
      return <ChevronsUpDown className="h-4 w-4" />
    }
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <SearchFilter
        placeholder="Search..."
        filters={filterOptions}
        onSearch={setSearchQuery}
        onFilter={setFilters}
        onClear={() => {
          setSearchQuery('')
          setFilters({})
        }}
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>
                  {column.sortable ? (
                    <Button
                      variant="ghost"
                      onClick={() => handleSort(column.key)}
                      className="h-auto p-0 font-medium hover:bg-transparent"
                    >
                      <div className="flex items-center gap-1">
                        {column.label}
                        {getSortIcon(column.key)}
                      </div>
                    </Button>
                  ) : (
                    column.label
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              processedData.map((row, index) => (
                <TableRow
                  key={row.id || index}
                  onClick={() => onRowClick?.(row)}
                  className={onRowClick ? 'cursor-pointer hover:bg-muted/50' : ''}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key}>
                      {column.render ? column.render(row[column.key], row) : row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="text-sm text-muted-foreground">
        Showing {processedData.length} of {data.length} results
      </div>
    </div>
  )
} 