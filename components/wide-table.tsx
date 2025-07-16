"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download, ChevronLeft, ChevronRight, SlidersHorizontal, Pin, PinOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { exportTableToCSV } from "@/lib/utils/export-utils"

interface WideTableViewProps {
  data?: any[]
  columns?: string[]
  title?: string
  sql?: string
  showTabs?: boolean
  canVisualize?: boolean
  activeTab?: "table" | "visualization"
  setActiveTab?: (tab: "table" | "visualization") => void
}

export default function WideTableView({ 
  data = [], 
  columns = [], 
  title = "Data Explorer",
  sql,
  showTabs = false,
  canVisualize = false,
  activeTab,
  setActiveTab
}: WideTableViewProps) {
  // Early return if no columns are provided
  if (columns.length === 0) {
    return (
      <div className="w-full space-y-6 overflow-auto">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 rounded-2xl border border-border/50">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-2xl flex items-center justify-center">
              <SlidersHorizontal className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="hidden md:block text-xl font-semibold text-foreground">{title}</h3>
              <p className="text-muted-foreground mt-2">No columns configured for display</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Early return if no data is provided
  if (data.length === 0) {
    return (
      <div className="w-full sm:space-y-6 space-y-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-2 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl border border-border/50">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{title}</h2>
            <p className="text-muted-foreground mt-1">Ready to display your data</p>
          </div>
          <Button variant="outline" size="sm" disabled className="bg-background/50">
            <Download className="sm:h-4 sm:w-4 h-3 w-3 mr-2" />
          </Button>
        </div>
        
        {sql && (
          <Card className="sm:p-4 p-2 border-dashed border-2 border-border/50 bg-muted/20">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">SQL Query:</h3>
              <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono bg-muted/30 p-3 rounded">
                {sql}
              </pre>
            </div>
          </Card>
        )}

        <Card className="text-center border-dashed border-2 border-border/50 bg-muted/20">
          <div className="p-2">
            <div>
              <h3 className="text-lg font-medium text-foreground">No data was found for this query. The records may not exist or might be deactivated.</h3>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(columns.slice(0, 10)))
  const [pinnedColumns, setPinnedColumns] = useState<Set<string>>(new Set(columns.length > 0 ? [columns[0]] : []))
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(25)
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [showAllColumns, setShowAllColumns] = useState(false)

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data

    return data.filter((row) => {
      return Object.entries(row).some(([key, value]) => {
        if (!visibleColumns.has(key)) return false
        return String(value).toLowerCase().includes(searchTerm.toLowerCase())
      })
    })
  }, [data, searchTerm, visibleColumns])

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData

    return [...filteredData].sort((a, b) => {
      const valueA = a[sortColumn]
      const valueB = b[sortColumn]

      // Handle different data types
      if (typeof valueA === "number" && typeof valueB === "number") {
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA
      }

      // Convert to strings for comparison
      const strA = String(valueA || "").toLowerCase()
      const strB = String(valueB || "").toLowerCase()

      if (sortDirection === "asc") {
        return strA.localeCompare(strB)
      } else {
        return strB.localeCompare(strA)
      }
    })
  }, [filteredData, sortColumn, sortDirection])

  // Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage
    return sortedData.slice(startIndex, startIndex + rowsPerPage)
  }, [sortedData, currentPage, rowsPerPage])

  const totalPages = Math.ceil(sortedData.length / rowsPerPage)

  // Organize columns: pinned first, then visible
  const organizedColumns = useMemo(() => {
    const pinned = columns.filter((col) => pinnedColumns.has(col))
    const visible = columns.filter((col) => visibleColumns.has(col) && !pinnedColumns.has(col))
    return [...pinned, ...visible]
  }, [columns, visibleColumns, pinnedColumns])

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const handleExportCSV = async () => {
    const visibleData = sortedData.map((row) => {
      const newRow: Record<string, any> = {}
      organizedColumns.forEach((col) => {
        newRow[col] = row[col]
      })
      return newRow
    })

    await exportTableToCSV(organizedColumns, visibleData, `data_export_${new Date().toISOString().slice(0, 10)}.csv`)
  }

  const toggleColumnVisibility = (column: string) => {
    const newVisibleColumns = new Set(visibleColumns)
    if (newVisibleColumns.has(column)) {
      // Don't allow hiding if it's the last visible column
      if (newVisibleColumns.size > 1) {
        newVisibleColumns.delete(column)
        // If column is pinned, unpin it
        if (pinnedColumns.has(column)) {
          const newPinnedColumns = new Set(pinnedColumns)
          newPinnedColumns.delete(column)
          setPinnedColumns(newPinnedColumns)
        }
      }
    } else {
      newVisibleColumns.add(column)
    }
    setVisibleColumns(newVisibleColumns)
  }

  const toggleColumnPin = (column: string) => {
    const newPinnedColumns = new Set(pinnedColumns)

    if (newPinnedColumns.has(column)) {
      newPinnedColumns.delete(column)
    } else {
      // Ensure column is visible before pinning
      if (!visibleColumns.has(column)) {
        const newVisibleColumns = new Set(visibleColumns)
        newVisibleColumns.add(column)
        setVisibleColumns(newVisibleColumns)
      }
      newPinnedColumns.add(column)
    }

    setPinnedColumns(newPinnedColumns)
  }

  // Add this new function to handle fit to view
  const handleFitToView = () => {
    if (showAllColumns) {
      // When switching to fit view, show only first 10 columns
      setVisibleColumns(new Set(columns.slice(0, 10)))
      // Keep only the first column pinned
      setPinnedColumns(new Set(columns.length > 0 ? [columns[0]] : []))
    } else {
      // When switching to show all, make all columns visible
      setVisibleColumns(new Set(columns))
    }
    setShowAllColumns(!showAllColumns)
  }

  return (
    <div className="w-full space-y-6 overflow-auto">
      {/* Header Section - All Controls in One Line */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-2 bg-gradient-to-r from-primary/5 to-transparent rounded-2xl border border-border/50">
        <div className="flex items-center gap-2 w-full flex-wrap">
          {/* Tab Controls (if enabled) */}
          {showTabs && (
            <>
              <Button 
                variant={activeTab === "table" ? "outline" : "ghost"} 
                size="sm" 
                className={cn("h-8", activeTab === "table" && "bg-background shadow-sm")}
                onClick={() => setActiveTab?.("table")}
              >
                Table View
              </Button>
              {canVisualize && (
                <Button 
                  variant={activeTab === "visualization" ? "outline" : "ghost"} 
                  size="sm" 
                  className={cn("h-8", activeTab === "visualization" && "bg-background shadow-sm")}
                  onClick={() => setActiveTab?.("visualization")}
                >
                  Visualization
                </Button>
              )}
              <div className="hidden sm:block h-4 w-px bg-border mx-1" />
            </>
          )}
          
          {/* Column Controls */}
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <SlidersHorizontal className="h-4 w-4 mr-1" />
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 max-h-[60vh] overflow-auto">
                {columns.map((column, index) => (
                  <DropdownMenuCheckboxItem
                    key={index}
                    checked={visibleColumns.has(column)}
                    onCheckedChange={() => toggleColumnVisibility(column)}
                    className="capitalize"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span>{column}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-2"
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleColumnPin(column)
                        }}
                      >
                        {pinnedColumns.has(column) ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
                      </Button>
                    </div>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Show All Toggle */}
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={handleFitToView}
          >
            {showAllColumns ? "Fit View" : "Show All"}
          </Button>
          
          {/* Export CSV */}
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 bg-background/50"
            onClick={handleExportCSV}
          >
            <Download className="h-4 w-4 mr-2" />
          </Button>
        </div>
      </div>

      {/* SQL Query Section */}
      {sql && (
        <Card className="p-4 border-dashed border-2 border-border/50 bg-muted/20">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">SQL Query:</h3>
            <pre className="text-sm text-muted-foreground whitespace-pre-wrap font-mono bg-muted/30 p-3 rounded">
              {sql}
            </pre>
          </div>
        </Card>
      )}
      
      {/* Table Section */}
      <Card className="border-border/50 shadow-sm bg-background/80 backdrop-blur-sm">
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border/50">
                {organizedColumns.map((column, i) => (
                  <TableHead
                    key={i}
                    className={cn(
                      "bg-muted/40 text-xs uppercase tracking-wider font-semibold text-muted-foreground cursor-pointer whitespace-nowrap md:h-12 h-8 transition-colors duration-150 hover:bg-muted/60",
                      pinnedColumns.has(column) && "sticky left-0 z-20 bg-muted/60 shadow-lg border-r border-border/50",
                      sortColumn === column && "bg-primary/10 text-primary"
                    )}
                    onClick={() => handleSort(column)}
                  >
                    <div className="flex items-center gap-2 py-1">
                      <span className="">{column}</span>
                      {pinnedColumns.has(column) && (
                        <Pin className="h-3 w-3 text-primary flex-shrink-0" />
                      )}
                      {sortColumn === column && (
                        <span className="text-primary flex-shrink-0">
                          {sortDirection === "asc" ? "↑" : "↓"}
                        </span>
                      )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((row, rowIndex) => (
                  <TableRow 
                    key={rowIndex} 
                    className="hover:bg-muted/30 transition-colors duration-150 border-border/30"
                  >
                    {organizedColumns.map((column, colIndex) => (
                      <TableCell
                        key={`${rowIndex}+${colIndex}`}
                        className={cn(
                          "py-3 text-sm whitespace-nowrap font-medium",
                          pinnedColumns.has(column) && "sticky left-0 z-10 bg-background shadow-sm border-r border-border/30"
                        )}
                      >
                        <span className="block max-w-[200px]">
                          {row[column] !== undefined && row[column] !== null ? (
                            String(row[column]).startsWith("TrinoUserError") || String(row[column]).startsWith("TrinoQueryError") ? (
                              <span className="text-amber-600 italic">This question is currently processing, please try later...</span>
                            ) : String(row[column])
                          ) : (
                            <span className="text-muted-foreground italic">—</span>
                          )}
                        </span>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={organizedColumns.length} className="h-32 text-center">
                    <div className="space-y-2">
                      <p className="text-muted-foreground">No results found for "{searchTerm}"</p>
                      <Button variant="outline" size="sm" onClick={() => setSearchTerm("")}>
                        Clear search
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Enhanced Pagination */}
        <div className="px-6 py-2 border-t border-border/50 bg-muted/20 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground font-medium">
              Showing {paginatedData.length > 0 ? ((currentPage - 1) * rowsPerPage + 1).toLocaleString() : 0} to{" "}
              {Math.min(currentPage * rowsPerPage, sortedData.length).toLocaleString()} of {sortedData.length.toLocaleString()} results
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Rows per page:</span>
                <select
                  className="h-9 rounded-md border border-input bg-background/80 px-3 text-sm font-medium focus:border-primary/50 focus:outline-none transition-colors duration-200"
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value))
                    setCurrentPage(1)
                  }}
                >
                  {[10, 25, 50, 100].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center rounded-md border border-border/50 bg-background/80">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-r-none hover:bg-accent/50"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="h-9 px-4 flex items-center justify-center border-x border-border/50 bg-muted/20 min-w-[80px]">
                  <span className="text-sm font-medium">
                    {currentPage} of {totalPages || 1}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-l-none hover:bg-accent/50"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
