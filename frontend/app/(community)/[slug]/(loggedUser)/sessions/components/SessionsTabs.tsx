"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import AvailableSessions from "@/app/(community)/[slug]/(loggedUser)/sessions/components/AvailableSessions"
import BookedSessions from "@/app/(community)/[slug]/(loggedUser)/sessions/components/BookedSessions"
import CalendarView from "@/app/(community)/[slug]/(loggedUser)/sessions/components/CalendarView"

interface SessionsTabsProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function SessionsTabs({ activeTab, setActiveTab }: SessionsTabsProps) {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
      <div className="flex items-center justify-between">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="available">Available</TabsTrigger>
          <TabsTrigger value="booked">My Sessions</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      <TabsContent value="available" className="space-y-6">
        <AvailableSessions />
      </TabsContent>

      <TabsContent value="booked" className="space-y-6">
        <BookedSessions setActiveTab={setActiveTab} />
      </TabsContent>

      <TabsContent value="calendar" className="space-y-6">
        <CalendarView />
      </TabsContent>
    </Tabs>
  )
}