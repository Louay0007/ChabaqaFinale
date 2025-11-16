"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
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
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  LayoutDashboard,
  BookOpen,
  Zap,
  Users,
  FileText,
  Palette,
  Calendar,
  Settings,
  ChevronDown,
  Plus,
  LogOut,
  User,
} from "lucide-react"

const menuItems = [
  {
    title: "Dashboard",
    url: "/creator/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Course Manager",
    url: "/creator/courses",
    icon: BookOpen,
    badge: "12",
    color: "courses",
  },
  {
    title: "Challenge Manager",
    url: "/creator/challenges",
    icon: Zap,
    badge: "1 Active",
    color: "challenges",
  },
  {
    title: "Session Manager",
    url: "/creator/sessions",
    icon: Calendar,
    badge: "8",
    color: "sessions",
  },
  {
    title: "Post Editor",
    url: "/creator/posts",
    icon: FileText,
    badge: "24",
  },
  {
    title: "Community Members",
    url: "/creator/members",
    icon: Users,
    badge: "1.2k",
  },
  {
    title: "Landing Page",
    url: "/creator/landing",
    icon: Palette,
  },
  {
    title: "Settings",
    url: "/creator/settings",
    icon: Settings,
  },
]

const communities = [
  {
    id: "1",
    name: "Web Development Mastery",
    slug: "web-dev-mastery",
    members: 1250,
    color: "#8e78fb",
  },
  {
    id: "2",
    name: "Design Thinking Hub",
    slug: "design-thinking-hub",
    members: 890,
    color: "#47c7ea",
  },
]

export function CreatorSidebar() {
  const pathname = usePathname()
  const [selectedCommunity, setSelectedCommunity] = useState(communities[0])

  return (
    <Sidebar className="border-r">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <span className="text-sm font-semibold">{selectedCommunity.name.charAt(0)}</span>
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{selectedCommunity.name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {selectedCommunity.members.toLocaleString()} members
                    </span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                <DropdownMenuItem className="gap-2 p-2">
                  <div className="flex size-6 items-center justify-center rounded-sm border">
                    <Plus className="size-4" />
                  </div>
                  <div className="font-medium text-muted-foreground">Add Community</div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {communities.map((community) => (
                  <DropdownMenuItem
                    key={community.id}
                    className="gap-2 p-2"
                    onClick={() => setSelectedCommunity(community)}
                  >
                    <div
                      className="flex size-6 items-center justify-center rounded-sm"
                      style={{ backgroundColor: community.color }}
                    >
                      <span className="text-xs font-semibold text-white">{community.name.charAt(0)}</span>
                    </div>
                    <div className="font-medium">{community.name}</div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Creator Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url} className="group">
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant="secondary"
                          className={cn(
                            "ml-auto text-xs",
                            item.color === "courses" && "bg-courses-100 text-courses-700",
                            item.color === "challenges" && "bg-challenges-100 text-challenges-700",
                            item.color === "sessions" && "bg-sessions-100 text-sessions-700",
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Sarah Johnson" />
                    <AvatarFallback className="rounded-lg">SJ</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Sarah Johnson</span>
                    <span className="truncate text-xs text-muted-foreground">Creator</span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}

export function CreatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <CreatorSidebar />
        <div className="flex-1">
          <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              <SidebarTrigger className="-ml-1" />
              <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                <div className="w-full flex-1 md:w-auto md:flex-none">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-primary-500 to-primary-600 rounded flex items-center justify-center">
                      <span className="text-white font-bold text-xs">C</span>
                    </div>
                    <span className="font-semibold gradient-text">Chabaqa Creator</span>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
