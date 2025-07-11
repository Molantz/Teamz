"use client"

import { Header } from "@/components/header"
import { SidebarInset } from "@/components/ui/sidebar"
import { AuditLogViewer } from "@/components/audit-log-viewer"
import { auditLogger } from "@/lib/audit-log"
import { useEffect, useState } from "react"

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([])

  useEffect(() => {
    // Get all logs from the audit logger
    const allLogs = auditLogger.getLogs()
    setLogs(allLogs)
  }, [])

  const handleExport = (format: 'json' | 'csv') => {
    const exportedData = auditLogger.exportLogs(format)
    
    // Create and download the file
    const blob = new Blob([exportedData], { 
      type: format === 'json' ? 'application/json' : 'text/csv' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs.${format}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <SidebarInset>
      <Header 
        title="Audit Logs" 
        description="Monitor and review all system activities, user actions, and security events" 
      />
      <div className="flex-1 space-y-6 p-6">
        <AuditLogViewer 
          logs={logs} 
          onExport={handleExport}
        />
      </div>
    </SidebarInset>
  )
} 