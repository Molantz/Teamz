"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from '@/components/auth-provider'

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    url: string
  }
  category: 'incident' | 'request' | 'approval' | 'system' | 'device'
}

interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  removeNotification: (id: string) => void
  clearAll: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const { user } = useAuth()

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem('notifications')
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications)
        setNotifications(parsed.map((n: any) => ({
          ...n,
          timestamp: new Date(n.timestamp)
        })))
      } catch (error) {
        console.error('Failed to load notifications:', error)
      }
    }
  }, [])

  // Save notifications to localStorage when they change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications))
  }, [notifications])

  // Mock real-time notifications (in real app, this would be WebSocket or SSE)
  useEffect(() => {
    if (!user) return

    const interval = setInterval(() => {
      // Simulate new notifications
      const shouldAddNotification = Math.random() < 0.1 // 10% chance every interval
      
      if (shouldAddNotification) {
        const mockNotifications = [
          {
            type: 'warning' as const,
            title: 'New Incident Reported',
            message: 'Network connectivity issue in Building B',
            category: 'incident' as const,
            action: {
              label: 'View Details',
              url: '/incidents'
            }
          },
          {
            type: 'info' as const,
            title: 'Request Pending Approval',
            message: 'Adobe Creative Suite license request needs your review',
            category: 'request' as const,
            action: {
              label: 'Review',
              url: '/requests'
            }
          },
          {
            type: 'success' as const,
            title: 'Device Assignment Complete',
            message: 'MacBook Pro successfully assigned to Sarah Johnson',
            category: 'device' as const,
            action: {
              label: 'View Device',
              url: '/devices'
            }
          },
          {
            type: 'error' as const,
            title: 'System Alert',
            message: 'Server CPU usage is above 90%',
            category: 'system' as const,
            action: {
              label: 'Check Status',
              url: '/infrastructure'
            }
          }
        ]

        const randomNotification = mockNotifications[Math.floor(Math.random() * mockNotifications.length)]
        addNotification(randomNotification)
      }
    }, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [user])

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }
    
    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]) // Keep only last 50 notifications
  }

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter(notification => !notification.read).length

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification,
    clearAll
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
} 