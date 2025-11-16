"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type Campaign = {
  id: string
  name: string
  type: "regular" | "content-reminder" | "inactive-users"
  status: "draft" | "scheduled" | "sending" | "completed"
  sent: number
  opened: number
  clicked: number
  date: string
}

const campaigns: Campaign[] = [
  {
    id: "1",
    name: "Welcome Series - Day 1",
    type: "regular",
    status: "completed",
    sent: 1250,
    opened: 980,
    clicked: 456,
    date: "2025-10-20",
  },
  {
    id: "2",
    name: "Course Reminder - Web Dev",
    type: "content-reminder",
    status: "scheduled",
    sent: 0,
    opened: 0,
    clicked: 0,
    date: "2025-10-24",
  },
  {
    id: "3",
    name: "Re-engagement Campaign",
    type: "inactive-users",
    status: "sending",
    sent: 450,
    opened: 123,
    clicked: 45,
    date: "2025-10-23",
  },
]

export function EmailCampaignList() {
  return (
    <Card>
      <div className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Campaign Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sent</TableHead>
              <TableHead>Opened</TableHead>
              <TableHead>Clicked</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {campaign.type.replace("-", " ")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    className={
                      campaign.status === "completed" 
                        ? "bg-green-100 text-green-800"
                        : campaign.status === "sending"
                        ? "bg-blue-100 text-blue-800"
                        : campaign.status === "scheduled"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }
                  >
                    {campaign.status}
                  </Badge>
                </TableCell>
                <TableCell>{campaign.sent}</TableCell>
                <TableCell>{campaign.opened}</TableCell>
                <TableCell>{campaign.clicked}</TableCell>
                <TableCell>{campaign.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  )
}