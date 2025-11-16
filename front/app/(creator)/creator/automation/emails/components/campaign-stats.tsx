"use client"

import { Card } from "@/components/ui/card"
import { Users, Send, MousePointerClick, Mail } from "lucide-react"

const stats = [
  {
    name: "Total Subscribers",
    value: "2,543",
    change: "+12.3%",
    icon: Users,
  },
  {
    name: "Emails Sent",
    value: "15,234",
    change: "+8.2%",
    icon: Send,
  },
  {
    name: "Average Open Rate",
    value: "68.5%",
    change: "+5.1%",
    icon: Mail,
  },
  {
    name: "Click Rate",
    value: "24.3%",
    change: "+2.4%",
    icon: MousePointerClick,
  },
]

export function CampaignStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.name} className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">{stat.name}</p>
              <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              <p className="text-xs text-green-600 mt-1">{stat.change}</p>
            </div>
            <div className="bg-chabaqa-primary/10 p-2 rounded-full">
              <stat.icon className="w-5 h-5 text-chabaqa-primary" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}