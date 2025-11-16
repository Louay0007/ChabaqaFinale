"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Bell,
  Plus,
  Send,
  Users,
  BookOpen,
  Trophy,
  Calendar,
  ShoppingBag,
  Filter,
  Search,
  Edit,
  Trash2,
  Check,
  X,
  Settings,
  Clock,
  Mail,
  MessageSquare
} from "lucide-react"

interface NotificationRule {
  id: string
  name: string
  type: "community" | "course" | "challenge" | "event" | "product"
  trigger: string
  recipients: string
  message: string
  enabled: boolean
  channel: "in-app" | "email" | "both"
  createdAt: string
}

const initialNotificationRules: NotificationRule[] = [
  {
    id: "1",
    name: "New Member Welcome",
    type: "community",
    trigger: "member_joined",
    recipients: "new_members",
    message: "Welcome to our community! We're excited to have you here.",
    enabled: true,
    channel: "both",
    createdAt: "2024-01-15"
  },
  {
    id: "2",
    name: "Course Completion",
    type: "course",
    trigger: "course_completed",
    recipients: "course_participants",
    message: "Congratulations on completing the course! Here's your certificate.",
    enabled: true,
    channel: "email",
    createdAt: "2024-01-20"
  },
  {
    id: "3",
    name: "Challenge Winner",
    type: "challenge",
    trigger: "challenge_winner",
    recipients: "winners",
    message: "Congratulations! You've won the challenge!",
    enabled: true,
    channel: "both",
    createdAt: "2024-02-01"
  },
  {
    id: "4",
    name: "Event Reminder",
    type: "event",
    trigger: "event_24h_before",
    recipients: "event_attendees",
    message: "Don't forget! Your event starts tomorrow at {{eventTime}}.",
    enabled: true,
    channel: "email",
    createdAt: "2024-02-10"
  },
  {
    id: "5",
    name: "Inactive Member Re-engagement",
    type: "community",
    trigger: "inactive_30_days",
    recipients: "inactive_members",
    message: "We miss you! Come back and see what's new in the community.",
    enabled: false,
    channel: "email",
    createdAt: "2024-02-15"
  }
]

const typeConfig = {
  community: {
    icon: Users,
    color: "bg-blue-500",
    triggers: [
      { value: "member_joined", label: "Member Joined" },
      { value: "member_active", label: "Member Active" },
      { value: "inactive_7_days", label: "Inactive 7 Days" },
      { value: "inactive_30_days", label: "Inactive 30 Days" },
      { value: "post_published", label: "New Post Published" }
    ],
    recipients: [
      { value: "all_members", label: "All Members" },
      { value: "new_members", label: "New Members" },
      { value: "active_members", label: "Active Members" },
      { value: "inactive_members", label: "Inactive Members" }
    ]
  },
  course: {
    icon: BookOpen,
    color: "bg-green-500",
    triggers: [
      { value: "course_enrolled", label: "Course Enrolled" },
      { value: "lesson_completed", label: "Lesson Completed" },
      { value: "course_completed", label: "Course Completed" },
      { value: "quiz_passed", label: "Quiz Passed" },
      { value: "quiz_failed", label: "Quiz Failed" }
    ],
    recipients: [
      { value: "all_students", label: "All Students" },
      { value: "course_participants", label: "Course Participants" },
      { value: "completed_students", label: "Completed Students" },
      { value: "in_progress", label: "In Progress Students" }
    ]
  },
  challenge: {
    icon: Trophy,
    color: "bg-yellow-500",
    triggers: [
      { value: "challenge_started", label: "Challenge Started" },
      { value: "challenge_completed", label: "Challenge Completed" },
      { value: "challenge_winner", label: "Challenge Winner" },
      { value: "milestone_reached", label: "Milestone Reached" },
      { value: "leaderboard_top10", label: "Top 10 Leaderboard" }
    ],
    recipients: [
      { value: "all_participants", label: "All Participants" },
      { value: "active_participants", label: "Active Participants" },
      { value: "winners", label: "Winners Only" },
      { value: "top_performers", label: "Top Performers" }
    ]
  },
  event: {
    icon: Calendar,
    color: "bg-purple-500",
    triggers: [
      { value: "event_registered", label: "Event Registered" },
      { value: "event_24h_before", label: "24 Hours Before Event" },
      { value: "event_1h_before", label: "1 Hour Before Event" },
      { value: "event_started", label: "Event Started" },
      { value: "event_ended", label: "Event Ended" }
    ],
    recipients: [
      { value: "all_attendees", label: "All Attendees" },
      { value: "event_attendees", label: "Registered Attendees" },
      { value: "vip_attendees", label: "VIP Attendees" },
      { value: "waitlist", label: "Waitlist" }
    ]
  },
  product: {
    icon: ShoppingBag,
    color: "bg-pink-500",
    triggers: [
      { value: "product_purchased", label: "Product Purchased" },
      { value: "payment_success", label: "Payment Success" },
      { value: "payment_failed", label: "Payment Failed" },
      { value: "subscription_renewed", label: "Subscription Renewed" },
      { value: "subscription_expiring", label: "Subscription Expiring" }
    ],
    recipients: [
      { value: "all_customers", label: "All Customers" },
      { value: "buyers", label: "Product Buyers" },
      { value: "subscribers", label: "Active Subscribers" },
      { value: "trial_users", label: "Trial Users" }
    ]
  }
}

export default function NotificationsPage() {
  const [rules, setRules] = useState(initialNotificationRules)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingRule, setEditingRule] = useState<NotificationRule | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  
  // Form states
  const [notificationName, setNotificationName] = useState("")
  const [notificationType, setNotificationType] = useState<keyof typeof typeConfig>("community")
  const [trigger, setTrigger] = useState("")
  const [recipients, setRecipients] = useState("")
  const [message, setMessage] = useState("")
  const [channel, setChannel] = useState<"in-app" | "email" | "both">("both")
  const [enabled, setEnabled] = useState(true)

  const handleToggleRule = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ))
  }

  const handleDeleteRule = (id: string) => {
    setRules(rules.filter(rule => rule.id !== id))
  }

  const handleEditRule = (rule: NotificationRule) => {
    setEditingRule(rule)
    setNotificationName(rule.name)
    setNotificationType(rule.type)
    setTrigger(rule.trigger)
    setRecipients(rule.recipients)
    setMessage(rule.message)
    setChannel(rule.channel)
    setEnabled(rule.enabled)
    setIsDialogOpen(true)
  }

  const handleSaveNotification = () => {
    if (editingRule) {
      // Update existing rule
      const updatedRule: NotificationRule = {
        ...editingRule,
        name: notificationName,
        type: notificationType,
        trigger,
        recipients,
        message,
        enabled,
        channel,
      }
      setRules(rules.map(rule => rule.id === editingRule.id ? updatedRule : rule))
    } else {
      // Create new rule
      const newRule: NotificationRule = {
        id: Date.now().toString(),
        name: notificationName,
        type: notificationType,
        trigger,
        recipients,
        message,
        enabled,
        channel,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setRules([newRule, ...rules])
    }
    setIsDialogOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setEditingRule(null)
    setNotificationName("")
    setNotificationType("community")
    setTrigger("")
    setRecipients("")
    setMessage("")
    setChannel("both")
    setEnabled(true)
  }

  const filteredRules = rules.filter(rule => {
    const matchesSearch = rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rule.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || rule.type === filterType
    return matchesSearch && matchesType
  })

  const getTypeIcon = (type: keyof typeof typeConfig) => {
    const Icon = typeConfig[type].icon
    return <Icon className="w-4 h-4" />
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Notification Management</h1>
          <p className="text-gray-500">Create and manage automated notifications for your members</p>
        </div>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Notification
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Rules</p>
              <p className="text-2xl font-bold">{rules.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Rules</p>
              <p className="text-2xl font-bold">{rules.filter(r => r.enabled).length}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Sent Today</p>
              <p className="text-2xl font-bold">1,247</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Send className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Open Rate</p>
              <p className="text-2xl font-bold">68%</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Mail className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="community">Community</SelectItem>
              <SelectItem value="course">Course</SelectItem>
              <SelectItem value="challenge">Challenge</SelectItem>
              <SelectItem value="event">Event</SelectItem>
              <SelectItem value="product">Product</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Notification Rules List */}
      <div className="space-y-3">
        {filteredRules.map((rule) => (
          <Card key={rule.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4 flex-1">
                <div className={`w-10 h-10 ${typeConfig[rule.type].color} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
                  {getTypeIcon(rule.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold">{rule.name}</h3>
                    <Badge variant="outline" className="capitalize">
                      {rule.type}
                    </Badge>
                    {rule.channel === "both" ? (
                      <Badge variant="secondary" className="text-xs">
                        <Bell className="w-3 h-3 mr-1" />
                        <Mail className="w-3 h-3" />
                      </Badge>
                    ) : rule.channel === "email" ? (
                      <Badge variant="secondary" className="text-xs">
                        <Mail className="w-3 h-3 mr-1" />
                        Email
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        <Bell className="w-3 h-3 mr-1" />
                        In-App
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-2">{rule.message}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>Trigger: <span className="font-medium text-gray-700">{rule.trigger}</span></span>
                    <span>•</span>
                    <span>Recipients: <span className="font-medium text-gray-700">{rule.recipients}</span></span>
                    <span>•</span>
                    <span>Created: {rule.createdAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 flex-shrink-0">
                <Switch
                  checked={rule.enabled}
                  onCheckedChange={() => handleToggleRule(rule.id)}
                />
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleEditRule(rule)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeleteRule(rule.id)}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Create/Edit Notification Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open)
        if (!open) resetForm()
      }}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingRule ? "Edit" : "Create"} Notification Rule</DialogTitle>
            <DialogDescription>
              {editingRule ? "Update" : "Set up"} automated notifications for your community members
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Notification Name</label>
              <Input
                placeholder="e.g., Welcome New Members"
                value={notificationName}
                onChange={(e) => setNotificationName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={notificationType} onValueChange={(value: any) => {
                setNotificationType(value)
                setTrigger("")
                setRecipients("")
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="community">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      Community
                    </div>
                  </SelectItem>
                  <SelectItem value="course">
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Course
                    </div>
                  </SelectItem>
                  <SelectItem value="challenge">
                    <div className="flex items-center">
                      <Trophy className="w-4 h-4 mr-2" />
                      Challenge
                    </div>
                  </SelectItem>
                  <SelectItem value="event">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Event
                    </div>
                  </SelectItem>
                  <SelectItem value="product">
                    <div className="flex items-center">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Product
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Trigger</label>
              <Select value={trigger} onValueChange={setTrigger}>
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger event" />
                </SelectTrigger>
                <SelectContent>
                  {typeConfig[notificationType].triggers.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Recipients</label>
              <Select value={recipients} onValueChange={setRecipients}>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipients" />
                </SelectTrigger>
                <SelectContent>
                  {typeConfig[notificationType].recipients.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea
                placeholder="Enter notification message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="h-24"
              />
              <p className="text-xs text-gray-500">
                Available variables: &#123;&#123;userName&#125;&#125;, &#123;&#123;communityName&#125;&#125;, &#123;&#123;eventTime&#125;&#125;
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notification Channel</label>
              <Select value={channel} onValueChange={(value: any) => setChannel(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-app">In-App Only</SelectItem>
                  <SelectItem value="email">Email Only</SelectItem>
                  <SelectItem value="both">Both In-App & Email</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium">Enable Notification</p>
                <p className="text-xs text-gray-500">Activate this rule immediately</p>
              </div>
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveNotification}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!notificationName || !trigger || !recipients || !message}
            >
              {editingRule ? "Update" : "Create"} Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}