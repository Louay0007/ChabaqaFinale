"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon, Star } from "lucide-react"
import { format } from "date-fns"

const bookedSessions = [
  {
    id: "1",
    session: {
      title: "1-on-1 Code Review Session",
      price: 150,
      mentor: {
        name: "Sarah Johnson"
      }
    },
    scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
  },
  {
    id: "2",
    session: {
      title: "Career Mentorship Session",
      price: 120,
      mentor: {
        name: "Sarah Johnson"
      }
    },
    scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  },
]

export default function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Session Calendar</CardTitle>
            <CardDescription>View all your upcoming sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border w-full"
              modifiers={{
                booked: bookedSessions.map((booking) => booking.scheduledAt),
              }}
              modifiersStyles={{
                booked: { backgroundColor: "#f0f9ff", color: "#0369a1", fontWeight: "bold" },
              }}
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            {bookedSessions.length > 0 ? (
              <div className="space-y-4">
                {bookedSessions.map((booking) => (
                  <div key={booking.id} className="p-3 bg-sessions-50 rounded-lg">
                    <div className="font-medium text-sm">{booking.session.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {format(booking.scheduledAt, "MMM dd, h:mm a")}
                    </div>
                    <div className="text-xs text-muted-foreground">with {booking.session.mentor.name}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <CalendarIcon className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">No upcoming sessions</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Sessions This Month</span>
              <span className="font-medium">{bookedSessions.length}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Total Spent</span>
              <span className="font-medium">
                ${bookedSessions.reduce((acc, booking) => acc + booking.session.price, 0)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Avg Rating Given</span>
              <span className="font-medium flex items-center">
                <Star className="h-3 w-3 mr-1 text-yellow-500 fill-current" />
                4.8
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}