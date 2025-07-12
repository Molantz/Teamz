'use client'

import { useState, useEffect } from 'react'
import { Bell, Settings, Check, X, Clock, AlertTriangle, Info, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  getNotificationSettings,
  updateNotificationSettings
} from '@/lib/api'
import type { Notification, NotificationSettings, User } from '@/lib/types'

interface NotificationSystemProps {
  currentUser: User
  onNotificationClick?: (notification: Notification) => void
}

export function NotificationSystem({ currentUser, onNotificationClick }: NotificationSystemProps) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [settings, setSettings] = useState<NotificationSettings | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (currentUser.id) {
      loadNotifications()
      loadSettings()
    }
  }, [currentUser.id])

  const loadNotifications = async () => {
    try {
      const data = await getNotifications(currentUser.id, false)
      setNotifications(data)
      setUnreadCount(data.filter(n => !n.read).length)
    } catch (error) {
      console.error('Failed to load notifications:', error)
    }
  }

  const loadSettings = async () => {
    try {
      const data = await getNotificationSettings(currentUser.id)
      setSettings(data)
    } catch (error) {
      console.error('Failed to load notification settings:', error)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId)
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead(currentUser.id)
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
      toast.success('All notifications marked as read')
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error)
      toast.error('Failed to mark all notifications as read')
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id)
    }
    onNotificationClick?.(notification)
  }

  const handleSettingsChange = async (key: keyof NotificationSettings, value: boolean) => {
    if (!settings) return

    try {
      const updatedSettings = await updateNotificationSettings(currentUser.id, {
        [key]: value
      })
      setSettings(updatedSettings)
      toast.success('Notification settings updated')
    } catch (error) {
      console.error('Failed to update notification settings:', error)
      toast.error('Failed to update notification settings')
    }
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <X className="h-4 w-4 text-red-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-200 bg-green-50'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50'
      case 'error':
        return 'border-red-200 bg-red-50'
      default:
        return 'border-blue-200 bg-blue-50'
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

  return (
    <>
      {/* Notification Bell */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <div className="flex items-center justify-between p-2">
            <h4 className="font-medium">Notifications</h4>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSettingsOpen(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                >
                  Mark all read
                </Button>
              )}
            </div>
          </div>
          <Separator />
          <ScrollArea className="h-64">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No notifications
              </div>
            ) : (
              <div className="p-2 space-y-2">
                {notifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-gray-50 ${
                      notification.read ? 'opacity-75' : ''
                    } ${getNotificationColor(notification.type)}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h5 className="font-medium text-sm truncate">
                            {notification.title}
                          </h5>
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(new Date(notification.created_at))}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          {notifications.length > 10 && (
            <>
              <Separator />
              <div className="p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full"
                  onClick={() => setIsOpen(true)}
                >
                  View all notifications
                </Button>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Full Notifications Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>All Notifications</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSettingsOpen(true)}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                {unreadCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMarkAllAsRead}
                  >
                    Mark all read
                  </Button>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-96">
            {notifications.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No notifications
              </div>
            ) : (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <Card key={notification.id} className={notification.read ? 'opacity-75' : ''}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium">{notification.title}</h5>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {notification.category.replace(/_/g, ' ')}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(new Date(notification.created_at))}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between">
                            {!notification.read && (
                              <Badge variant="secondary" className="text-xs">
                                Unread
                              </Badge>
                            )}
                            {notification.action_url && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  handleNotificationClick(notification)
                                  // Handle action URL navigation
                                }}
                              >
                                View Details
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Notification Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notification Settings</DialogTitle>
          </DialogHeader>
          {settings && (
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <Switch
                    id="email-notifications"
                    checked={settings.email_notifications}
                    onCheckedChange={(checked) => handleSettingsChange('email_notifications', checked)}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="push-notifications">Push Notifications</Label>
                  <Switch
                    id="push-notifications"
                    checked={settings.push_notifications}
                    onCheckedChange={(checked) => handleSettingsChange('push_notifications', checked)}
                  />
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-medium">PR Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pr-status">Status Updates</Label>
                    <Switch
                      id="pr-status"
                      checked={settings.pr_status_updates}
                      onCheckedChange={(checked) => handleSettingsChange('pr_status_updates', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pr-approvals">Approvals</Label>
                    <Switch
                      id="pr-approvals"
                      checked={settings.pr_approvals}
                      onCheckedChange={(checked) => handleSettingsChange('pr_approvals', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pr-assignments">Assignments</Label>
                    <Switch
                      id="pr-assignments"
                      checked={settings.pr_assignments}
                      onCheckedChange={(checked) => handleSettingsChange('pr_assignments', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pr-deliveries">Deliveries</Label>
                    <Switch
                      id="pr-deliveries"
                      checked={settings.pr_deliveries}
                      onCheckedChange={(checked) => handleSettingsChange('pr_deliveries', checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="pr-incomplete">Incomplete Information</Label>
                    <Switch
                      id="pr-incomplete"
                      checked={settings.pr_incomplete_info}
                      onCheckedChange={(checked) => handleSettingsChange('pr_incomplete_info', checked)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsSettingsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 