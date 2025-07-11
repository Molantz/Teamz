export interface AuditLogEntry {
  id: string
  timestamp: Date
  userId: string
  userName: string
  action: string
  entityType: string
  entityId?: string
  details: string
  ipAddress?: string
  userAgent?: string
  severity: 'info' | 'warning' | 'error' | 'critical'
  category: 'user' | 'system' | 'security' | 'bulk_operation' | 'data_access'
}

class AuditLogger {
  private logs: AuditLogEntry[] = []

  constructor() {
    // Initialize with some sample logs for demonstration
    this.initializeSampleLogs()
  }

  private initializeSampleLogs() {
    const sampleLogs: Omit<AuditLogEntry, 'id' | 'timestamp'>[] = [
      {
        userId: 'admin-001',
        userName: 'John Doe',
        action: 'User Login',
        entityType: 'authentication',
        details: 'Successful login from IP 192.168.1.100',
        severity: 'info',
        category: 'security'
      },
      {
        userId: 'admin-001',
        userName: 'John Doe',
        action: 'Created User',
        entityType: 'user',
        entityId: 'user-123',
        details: 'Created new user: Sarah Johnson (sarah.johnson@company.com)',
        severity: 'info',
        category: 'user'
      },
      {
        userId: 'admin-001',
        userName: 'John Doe',
        action: 'Bulk Deleted Users',
        entityType: 'user',
        details: 'Deleted 3 users: Mike Smith, Lisa Brown, Tom Wilson',
        severity: 'warning',
        category: 'bulk_operation'
      },
      {
        userId: 'tech-002',
        userName: 'Laurian Lawrence',
        action: 'Assigned Device',
        entityType: 'device',
        entityId: 'dev-456',
        details: 'Assigned Dell Latitude 7420 to Sarah Johnson',
        severity: 'info',
        category: 'user'
      },
      {
        userId: 'system',
        userName: 'System',
        action: 'Backup Completed',
        entityType: 'system',
        details: 'Daily backup completed successfully - 2.3GB data backed up',
        severity: 'info',
        category: 'system'
      },
      {
        userId: 'admin-001',
        userName: 'John Doe',
        action: 'Failed Login Attempt',
        entityType: 'authentication',
        details: 'Failed login attempt for user admin from IP 203.0.113.45',
        severity: 'warning',
        category: 'security'
      },
      {
        userId: 'tech-002',
        userName: 'Laurian Lawrence',
        action: 'Bulk Exported Users',
        entityType: 'user',
        details: 'Exported 15 users to CSV format',
        severity: 'info',
        category: 'bulk_operation'
      },
      {
        userId: 'admin-001',
        userName: 'John Doe',
        action: 'Updated User Status',
        entityType: 'user',
        entityId: 'user-789',
        details: 'Changed user status from Active to Inactive for David Miller',
        severity: 'info',
        category: 'user'
      }
    ]

    sampleLogs.forEach(log => this.log(log))
  }

  log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) {
    const logEntry: AuditLogEntry = {
      ...entry,
      id: this.generateId(),
      timestamp: new Date(),
    }
    
    this.logs.push(logEntry)
    
    // In a real application, this would be sent to a logging service
    console.log('AUDIT LOG:', logEntry)
    
    return logEntry
  }

  logUserAction(
    userId: string,
    userName: string,
    action: string,
    entityType: string,
    entityId?: string,
    details?: string
  ) {
    return this.log({
      userId,
      userName,
      action,
      entityType,
      entityId,
      details: details || `${action} on ${entityType}`,
      severity: 'info',
      category: 'user'
    })
  }

  logBulkOperation(
    userId: string,
    userName: string,
    action: string,
    entityType: string,
    itemCount: number,
    details?: string
  ) {
    return this.log({
      userId,
      userName,
      action,
      entityType,
      details: details || `${action} on ${itemCount} ${entityType}`,
      severity: 'info',
      category: 'bulk_operation'
    })
  }

  logSecurityEvent(
    userId: string,
    userName: string,
    action: string,
    details: string,
    severity: 'warning' | 'error' | 'critical' = 'warning'
  ) {
    return this.log({
      userId,
      userName,
      action,
      entityType: 'security',
      details,
      severity,
      category: 'security'
    })
  }

  logSystemEvent(
    action: string,
    details: string,
    severity: 'info' | 'warning' | 'error' = 'info'
  ) {
    return this.log({
      userId: 'system',
      userName: 'System',
      action,
      entityType: 'system',
      details,
      severity,
      category: 'system'
    })
  }

  getLogs(
    filters?: {
      userId?: string
      entityType?: string
      category?: string
      severity?: string
      startDate?: Date
      endDate?: Date
    }
  ): AuditLogEntry[] {
    let filteredLogs = [...this.logs]

    if (filters?.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filters.userId)
    }

    if (filters?.entityType) {
      filteredLogs = filteredLogs.filter(log => log.entityType === filters.entityType)
    }

    if (filters?.category) {
      filteredLogs = filteredLogs.filter(log => log.category === filters.category)
    }

    if (filters?.severity) {
      filteredLogs = filteredLogs.filter(log => log.severity === filters.severity)
    }

    if (filters?.startDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp >= filters.startDate!)
    }

    if (filters?.endDate) {
      filteredLogs = filteredLogs.filter(log => log.timestamp <= filters.endDate!)
    }

    return filteredLogs.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  getLogsByUser(userId: string): AuditLogEntry[] {
    return this.getLogs({ userId })
  }

  getLogsByEntity(entityType: string): AuditLogEntry[] {
    return this.getLogs({ entityType })
  }

  getSecurityLogs(): AuditLogEntry[] {
    return this.getLogs({ category: 'security' })
  }

  getBulkOperationLogs(): AuditLogEntry[] {
    return this.getLogs({ category: 'bulk_operation' })
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  // Export logs for compliance
  exportLogs(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = ['ID', 'Timestamp', 'User ID', 'User Name', 'Action', 'Entity Type', 'Entity ID', 'Details', 'Severity', 'Category']
      const rows = this.logs.map(log => [
        log.id,
        log.timestamp.toISOString(),
        log.userId,
        log.userName,
        log.action,
        log.entityType,
        log.entityId || '',
        log.details,
        log.severity,
        log.category
      ])
      
      return [headers, ...rows].map(row => row.join(',')).join('\n')
    }
    
    return JSON.stringify(this.logs, null, 2)
  }
}

export const auditLogger = new AuditLogger() 