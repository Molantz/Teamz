"use client"
import {
  BarChart3,
  Building2,
  Calendar,
  ChevronUp,
  Cog,
  Database,
  FolderKanban,
  Home,
  Laptop,
  Network,
  Package,
  Settings,
  ShieldAlert,
  User2,
  Users,
  Wrench,
  FileText,
  Smartphone,
  Printer,
  UserCheck,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { usePathname } from "next/navigation"

// Mock user data - in real app, this would come from auth context
const user = {
  name: "John Doe",
  email: "john.doe@company.com",
  role: "Admin",
  avatar: "/placeholder.svg?height=32&width=32",
}

// Navigation items based on user role
const navigationItems = [
  {
    title: "Overview",
    items: [
      {
        title: "Dashboard",
        url: "/",
        icon: Home,
      },
      {
        title: "Manager Dashboard",
        url: "/manager-dashboard",
        icon: BarChart3,
      },
      {
        title: "Analytics",
        url: "/analytics",
        icon: BarChart3,
      },
    ],
  },
  {
    title: "User Management",
    items: [
      {
        title: "Users",
        url: "/users",
        icon: Users,
      },
      {
        title: "Employees",
        url: "/employees",
        icon: User2,
      },
      {
        title: "Departments",
        url: "/departments",
        icon: Building2,
      },
    ],
  },
  {
    title: "IT Operations",
    items: [
      {
        title: "Inventory",
        url: "/inventory",
        icon: Package,
      },
      {
        title: "Devices",
        url: "/devices",
        icon: Laptop,
      },
      {
        title: "Airtime Bundles",
        url: "/airtime-bundles",
        icon: Smartphone,
      },
      {
        title: "Printers",
        url: "/printers",
        icon: Printer,
      },
      {
        title: "Network",
        url: "/network",
        icon: Network,
      },
      {
        title: "Technicians",
        url: "/technicians",
        icon: UserCheck,
      },
      {
        title: "Infrastructure",
        url: "/infrastructure",
        icon: Network,
      },
      {
        title: "Projects",
        url: "/projects",
        icon: FolderKanban,
      },
    ],
  },
  {
    title: "Support",
    items: [
      {
        title: "Incidents",
        url: "/incidents",
        icon: ShieldAlert,
      },
      {
        title: "Requests",
        url: "/requests",
        icon: Wrench,
      },
      {
        title: "Activities",
        url: "/activities",
        icon: Calendar,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        title: "Backups",
        url: "/backups",
        icon: Database,
      },
      {
        title: "Audit Logs",
        url: "/audit-logs",
        icon: FileText,
      },
      {
        title: "Settings",
        url: "/settings",
        icon: Settings,
      },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar variant="inset" className="border-r">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Cog className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Teamz⚙️</span>
                  <span className="truncate text-xs">IT Management</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {navigationItems.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="rounded-lg">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                    <span className="truncate text-xs">{user.role}</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
