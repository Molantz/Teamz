"use client"

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { SidebarInset } from "@/components/ui/sidebar"
import {
  Settings,
  Users,
  Shield,
  Bell,
  Database,
  Palette,
  Mail,
  HardDrive,
  Clock,
  CreditCard,
  Save,
  Download,
  Upload,
  Eye,
  Printer,
  QrCode,
  Camera,
} from "lucide-react"
import { useState } from "react"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general")

  return (
    <SidebarInset>
      <Header
        title="System Configuration"
        description="Configure system preferences, security, and administrative options"
      />
      <div className="flex-1 p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-7">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Alerts</TabsTrigger>
            <TabsTrigger value="data">Data</TabsTrigger>
            <TabsTrigger value="appearance">Theme</TabsTrigger>
            <TabsTrigger value="idcards">ID Cards</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    System Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="system-name">System Name</Label>
                    <Input id="system-name" defaultValue="Teamz⚙️ IT Management" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="organization">Organization</Label>
                    <Input id="organization" defaultValue="Your Company Ltd." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Time Zone</Label>
                    <Select defaultValue="utc">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">Eastern Time</SelectItem>
                        <SelectItem value="pst">Pacific Time</SelectItem>
                        <SelectItem value="gmt">GMT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Default Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                        <SelectItem value="de">German</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Email Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-host">SMTP Host</Label>
                    <Input id="smtp-host" placeholder="smtp.gmail.com" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="smtp-port">Port</Label>
                      <Input id="smtp-port" defaultValue="587" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtp-security">Security</Label>
                      <Select defaultValue="tls">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="ssl">SSL</SelectItem>
                          <SelectItem value="tls">TLS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-username">Username</Label>
                    <Input id="smtp-username" type="email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-password">Password</Label>
                    <Input id="smtp-password" type="password" />
                  </div>
                  <Button variant="outline" className="w-full bg-transparent">
                    <Mail className="h-4 w-4 mr-2" />
                    Test Email Configuration
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardDrive className="h-5 w-5" />
                    Backup Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="backup-frequency">Backup Frequency</Label>
                    <Select defaultValue="daily">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="retention-days">Retention Period (Days)</Label>
                    <Input id="retention-days" type="number" defaultValue="30" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="backup-encryption" defaultChecked />
                    <Label htmlFor="backup-encryption">Enable Encryption</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="backup-compression" defaultChecked />
                    <Label htmlFor="backup-compression">Enable Compression</Label>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Maintenance Windows
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="maintenance-day">Maintenance Day</Label>
                    <Select defaultValue="sunday">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunday">Sunday</SelectItem>
                        <SelectItem value="monday">Monday</SelectItem>
                        <SelectItem value="tuesday">Tuesday</SelectItem>
                        <SelectItem value="wednesday">Wednesday</SelectItem>
                        <SelectItem value="thursday">Thursday</SelectItem>
                        <SelectItem value="friday">Friday</SelectItem>
                        <SelectItem value="saturday">Saturday</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="maintenance-start">Start Time</Label>
                      <Input id="maintenance-start" type="time" defaultValue="02:00" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="maintenance-end">End Time</Label>
                      <Input id="maintenance-end" type="time" defaultValue="06:00" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="maintenance-notifications" defaultChecked />
                    <Label htmlFor="maintenance-notifications">Send Notifications</Label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* ID Cards Management */}
          <TabsContent value="idcards" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      ID Card Template Designer
                    </CardTitle>
                    <CardDescription>Customize the layout and appearance of employee ID cards</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="card-width">Card Width (mm)</Label>
                        <Input id="card-width" type="number" defaultValue="85.6" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-height">Card Height (mm)</Label>
                        <Input id="card-height" type="number" defaultValue="53.98" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="card-template">Template Style</Label>
                      <Select defaultValue="corporate">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="corporate">Corporate Blue</SelectItem>
                          <SelectItem value="modern">Modern Minimal</SelectItem>
                          <SelectItem value="colorful">Colorful Gradient</SelectItem>
                          <SelectItem value="classic">Classic White</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company-logo">Company Logo</Label>
                      <div className="flex items-center gap-2">
                        <Input id="company-logo" type="file" accept="image/*" />
                        <Button variant="outline" size="sm">
                          <Upload className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">Card Fields Configuration</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2">
                          <Switch id="show-photo" defaultChecked />
                          <Label htmlFor="show-photo">Employee Photo</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="show-name" defaultChecked />
                          <Label htmlFor="show-name">Full Name</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="show-title" defaultChecked />
                          <Label htmlFor="show-title">Job Title</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="show-department" defaultChecked />
                          <Label htmlFor="show-department">Department</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="show-employee-id" defaultChecked />
                          <Label htmlFor="show-employee-id">Employee ID</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="show-qr-code" defaultChecked />
                          <Label htmlFor="show-qr-code">QR Code</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="show-signature" />
                          <Label htmlFor="show-signature">Signature</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch id="show-expiry" defaultChecked />
                          <Label htmlFor="show-expiry">Expiry Date</Label>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-4">
                      <h4 className="font-medium">Batch Operations</h4>
                      <div className="flex gap-2">
                        <Button variant="outline">
                          <Users className="h-4 w-4 mr-2" />
                          Generate for Department
                        </Button>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Export Templates
                        </Button>
                        <Button variant="outline">
                          <Printer className="h-4 w-4 mr-2" />
                          Print Queue
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Recent ID Card Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { action: "Generated", user: "John Smith", time: "2 hours ago", status: "Completed" },
                        { action: "Reprinted", user: "Sarah Johnson", time: "4 hours ago", status: "Completed" },
                        { action: "Generated", user: "Mike Wilson", time: "1 day ago", status: "Pending" },
                        {
                          action: "Batch Generated",
                          user: "Engineering Dept",
                          time: "2 days ago",
                          status: "Completed",
                        },
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="font-medium">
                              {activity.action} - {activity.user}
                            </div>
                            <div className="text-sm text-muted-foreground">{activity.time}</div>
                          </div>
                          <Badge variant={activity.status === "Completed" ? "default" : "secondary"}>
                            {activity.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* ID Card Preview */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Live Preview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-[1.6/1] bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-4 text-white relative overflow-hidden">
                      {/* Company Logo */}
                      <div className="absolute top-2 right-2">
                        <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                          <Settings className="h-4 w-4" />
                        </div>
                      </div>

                      {/* Employee Photo */}
                      <div className="w-16 h-16 bg-white/20 rounded-full mb-2 flex items-center justify-center">
                        <Camera className="h-6 w-6" />
                      </div>

                      {/* Employee Info */}
                      <div className="space-y-1">
                        <div className="font-bold text-sm">John Smith</div>
                        <div className="text-xs opacity-90">Senior IT Manager</div>
                        <div className="text-xs opacity-75">Information Technology</div>
                        <div className="text-xs opacity-75">ID: IT001</div>
                      </div>

                      {/* QR Code */}
                      <div className="absolute bottom-2 right-2">
                        <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                          <QrCode className="h-4 w-4" />
                        </div>
                      </div>

                      {/* Expiry */}
                      <div className="absolute bottom-2 left-2 text-xs opacity-75">Exp: 12/2025</div>
                    </div>

                    <div className="mt-4 space-y-2">
                      <Button className="w-full" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download PNG
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button variant="outline" className="w-full bg-transparent" size="sm">
                        <Printer className="h-4 w-4 mr-2" />
                        Print Card
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Cards Generated</span>
                      <span className="font-medium">247</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Pending Approval</span>
                      <span className="font-medium">3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Expiring Soon</span>
                      <span className="font-medium text-orange-600">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Reprints This Month</span>
                      <span className="font-medium">8</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Other tabs content would go here... */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management Settings</CardTitle>
                <CardDescription>Configure user roles, permissions, and defaults</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="default-role">Default User Role</Label>
                    <Select defaultValue="employee">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="employee">Employee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="invite-expiry">Invitation Expiry (days)</Label>
                    <Input id="invite-expiry" type="number" defaultValue="7" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="require-approval" defaultChecked />
                    <Label htmlFor="require-approval">Require admin approval for new users</Label>
                </div>
                  <Button type="submit">Save User Settings</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security policies and compliance</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="2fa" defaultChecked />
                    <Label htmlFor="2fa">Enable Two-Factor Authentication</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="password-policy" defaultChecked />
                    <Label htmlFor="password-policy">Enforce strong password policy</Label>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                    <Input id="session-timeout" type="number" defaultValue="30" />
                </div>
                  <Button type="submit">Save Security Settings</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure alerts and notification preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="email-alerts" defaultChecked />
                    <Label htmlFor="email-alerts">Enable Email Alerts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="sms-alerts" />
                    <Label htmlFor="sms-alerts">Enable SMS Alerts</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="push-alerts" />
                    <Label htmlFor="push-alerts">Enable Push Notifications</Label>
                </div>
                  <Button type="submit">Save Notification Settings</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Management</CardTitle>
                <CardDescription>Configure data retention and export settings</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="retention-days">Data Retention (days)</Label>
                    <Input id="retention-days" type="number" defaultValue="90" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-export" />
                    <Label htmlFor="auto-export">Enable automatic data export</Label>
                </div>
                  <Button type="submit">Save Data Settings</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>Customize UI theme and branding</CardDescription>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme</Label>
                    <Select defaultValue="light">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="brand-color">Brand Color</Label>
                    <Input id="brand-color" type="color" defaultValue="#2563eb" />
                </div>
                  <Button type="submit">Save Appearance Settings</Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <Button>
            <Save className="h-4 w-4 mr-2" />
            Save Configuration
          </Button>
        </div>
      </div>
    </SidebarInset>
  )
}
