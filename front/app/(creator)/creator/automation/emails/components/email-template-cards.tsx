"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, StarOff, Edit, Send } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface EmailTemplate {
  id: string
  name: string
  description: string
  segment: string
  useCount: number
  isStarred: boolean
  preview: string
  subject: string
  fullContent: string
}

const emailTemplates: EmailTemplate[] = [
  {
    id: "1",
    name: "Welcome New Member",
    description: "First welcome email for new community members",
    segment: "New Members",
    useCount: 1250,
    isStarred: true,
    preview: "Welcome to {{communityName}}! We're excited to have you join our community...",
    subject: "Welcome to {{communityName}}!",
    fullContent: "Welcome to {{communityName}}!\n\nWe're excited to have you join our community. Here's what you can expect:\n\n- Access to exclusive content\n- Connect with like-minded members\n- Participate in events and discussions\n\nLet's get started!\n\nBest regards,\nThe {{communityName}} Team"
  },
  {
    id: "2",
    name: "Course Reminder",
    description: "Reminder for upcoming course sessions",
    segment: "Course Participants",
    useCount: 856,
    isStarred: true,
    preview: "Don't forget about your upcoming course session in {{courseName}}...",
    subject: "Reminder: Your upcoming course session",
    fullContent: "Hi {{userName}},\n\nDon't forget about your upcoming course session in {{courseName}}.\n\nDate: {{courseDate}}\nTime: {{courseTime}}\n\nMake sure you're prepared and ready to participate!\n\nSee you there,\nThe Team"
  },
  {
    id: "3",
    name: "Re-engagement - 30 Days",
    description: "Re-engage members inactive for 30 days",
    segment: "Inactive Members",
    useCount: 542,
    isStarred: false,
    preview: "We miss you in {{communityName}}! Here's what you've been missing...",
    subject: "We miss you at {{communityName}}",
    fullContent: "Hi {{userName}},\n\nWe miss you in {{communityName}}! Here's what you've been missing:\n\n- New courses and content\n- Exciting community discussions\n- Upcoming events\n\nCome back and see what's new!\n\nWe'd love to have you back,\nThe {{communityName}} Team"
  },
  {
    id: "4",
    name: "Event Announcement",
    description: "Announce upcoming community events",
    segment: "All Members",
    useCount: 423,
    isStarred: true,
    preview: "Join us for an exciting upcoming event in {{communityName}}...",
    subject: "New Event at {{communityName}}",
    fullContent: "Hi {{userName}},\n\nJoin us for an exciting upcoming event in {{communityName}}!\n\nEvent: {{eventName}}\nDate: {{eventDate}}\nTime: {{eventTime}}\nLocation: {{eventLocation}}\n\nDon't miss out on this amazing opportunity!\n\nRegister now,\nThe {{communityName}} Team"
  },
  {
    id: "5",
    name: "Monthly Newsletter",
    description: "Monthly community updates and highlights",
    segment: "All Members",
    useCount: 980,
    isStarred: false,
    preview: "Your monthly update from {{communityName}} is here...",
    subject: "{{communityName}} - Monthly Newsletter",
    fullContent: "Hi {{userName}},\n\nYour monthly update from {{communityName}} is here!\n\nThis month's highlights:\n- Community achievements\n- New features\n- Upcoming events\n\nStay connected and engaged!\n\nBest regards,\nThe Team"
  },
  {
    id: "6",
    name: "Content Update",
    description: "Notify about new content releases",
    segment: "Content Subscribers",
    useCount: 675,
    isStarred: false,
    preview: "New content just dropped in {{communityName}}...",
    subject: "New Content Available: {{contentTitle}}",
    fullContent: "Hi {{userName}},\n\nNew content just dropped in {{communityName}}!\n\n{{contentTitle}}\n\nCheck it out now and let us know what you think.\n\nHappy learning,\nThe Content Team"
  }
]

export function EmailTemplateCards() {
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewAllOpen, setIsViewAllOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)
  
  const [campaignName, setCampaignName] = useState("")
  const [campaignType, setCampaignType] = useState("regular")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [sendingTime, setSendingTime] = useState("now")
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")
  const [inactiveDays, setInactiveDays] = useState("")

  const displayLimit = 4

  const handleUseTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setCampaignName(`Campaign: ${template.name}`)
    setCampaignType("regular")
    setSubject(template.subject)
    setContent(template.fullContent)
    setSendingTime("now")
    setScheduledDate("")
    setScheduledTime("")
    setInactiveDays("")
    setIsEditDialogOpen(true)
  }

  const handleSendCampaign = async () => {
    if (!campaignName || !subject || !content) {
      alert("Please fill in all required fields")
      return
    }

    setIsSending(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log("Sending campaign:", {
        campaignName,
        campaignType,
        subject,
        content,
        sendingTime,
        scheduledDate,
        scheduledTime,
        inactiveDays
      })
      setIsEditDialogOpen(false)
      setCampaignName("")
      setSubject("")
      setContent("")
      alert("Campaign created successfully!")
    } catch (error) {
      console.error("Error sending campaign:", error)
      alert("Error creating campaign")
    } finally {
      setIsSending(false)
    }
  }

  const displayedTemplates = isViewAllOpen ? emailTemplates : emailTemplates.slice(0, displayLimit)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Email Templates</h2>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsViewAllOpen(!isViewAllOpen)}
        >
          {isViewAllOpen ? "Show Less" : "View All Templates"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {displayedTemplates.map((template) => (
          <Card key={template.id} className="p-4 flex flex-col hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h3 className="font-medium text-sm">{template.name}</h3>
                <p className="text-gray-500 text-xs mt-1">{template.description}</p>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 flex-shrink-0"
              >
                {template.isStarred ? (
                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                ) : (
                  <StarOff className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </div>
            
            <Badge 
              variant="secondary" 
              className="w-fit mb-3"
            >
              {template.segment}
            </Badge>
            
            <p className="text-xs text-gray-600 line-clamp-2 mb-3 flex-grow">
              {template.preview}
            </p>
            
            <div className="flex flex-col gap-2 mt-auto pt-3 border-t">
              <span className="text-xs text-gray-500">
                Used {template.useCount} times
              </span>
              <Button 
                variant="default"
                size="sm" 
                className="w-full bg-chabaqa-primary hover:bg-chabaqa-primary/90"
                onClick={() => handleUseTemplate(template)}
              >
                <Edit className="h-3.5 w-3.5 mr-1.5" />
                Use & Edit Template
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Campaign Dialog with Template */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Campaign from Template</DialogTitle>
            <DialogDescription>
              {selectedTemplate && `Using template: ${selectedTemplate.name}`}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Campaign Name</label>
              <Input 
                placeholder="Enter campaign name..." 
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Campaign Type</label>
              <Select value={campaignType} onValueChange={setCampaignType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular Announcement</SelectItem>
                  <SelectItem value="content-reminder">Content Reminder</SelectItem>
                  <SelectItem value="inactive-users">Inactive Users</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">Choose the type of campaign you want to send</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Subject Line</label>
              <Input 
                placeholder="Enter email subject..." 
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Available variables: &#123;&#123;userName&#125;&#125;, &#123;&#123;communityName&#125;&#125;, &#123;&#123;currentDate&#125;&#125;
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Email Content</label>
              <Textarea
                placeholder="Write your email content..."
                className="h-40"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">When to send</label>
              <Select value={sendingTime} onValueChange={setSendingTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select when to send" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="now">Send Now</SelectItem>
                  <SelectItem value="scheduled">Schedule for Later</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {sendingTime === "scheduled" && (
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input 
                    type="date" 
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium">Time</label>
                  <Input 
                    type="time" 
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                </div>
              </div>
            )}

            {campaignType === "inactive-users" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Inactive for</label>
                <Select value={inactiveDays} onValueChange={setInactiveDays}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select inactive period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="15">15 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="60">60+ days</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  Target users who haven't been active for the selected period
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSendCampaign}
              className="bg-chabaqa-primary hover:bg-chabaqa-primary/90"
              disabled={isSending}
            >
              {isSending ? (
                "Creating..."
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Create Campaign
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}