import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { StatusBadge } from "@/components/ui/status-badge"
import { CalendarIcon, Clock, DollarSign, Video, MessageSquare, Plus } from "lucide-react"
import { format } from "date-fns"

const bookedSessions = [
  {
    id: "1",
    session: {
      title: "1-on-1 Code Review Session",
      description: "Get personalized feedback on your code and projects",
      duration: 60,
      price: 150,
      mentor: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Senior Developer",
      },
    },
    scheduledAt: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    status: "completed" as const,
    meetingUrl: "https://meet.google.com/abc-def-ghi",
    notes: "Review React project structure and component organization",
  },
  {
    id: "2",
    session: {
      title: "Career Mentorship Session",
      description: "Get guidance on your web development career path",
      duration: 45,
      price: 120,
      mentor: {
        name: "Sarah Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
        role: "Senior Developer",
      },
    },
    scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: "pending" as const,
    notes: "Discuss career transition from junior to mid-level developer",
  },
]

interface BookedSessionsProps {
  setActiveTab: (tab: string) => void
}

export default function BookedSessions({ setActiveTab }: BookedSessionsProps) {
  if (bookedSessions.length > 0) {
    return (
      <div className="space-y-4">
        {bookedSessions.map((booking) => (
          <Card key={booking.id} className="border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{booking.session.title}</h3>
                  <p className="text-muted-foreground">{booking.session.description}</p>
                </div>
                <StatusBadge status={booking.status} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={booking.session.mentor.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {booking.session.mentor.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{booking.session.mentor.name}</div>
                      <div className="text-sm text-muted-foreground">{booking.session.mentor.role}</div>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      {format(booking.scheduledAt, "EEEE, MMMM dd, yyyy")}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      {format(booking.scheduledAt, "h:mm a")} ({booking.session.duration} minutes)
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />${booking.session.price}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {booking.notes && (
                    <div>
                      <h4 className="font-medium mb-2">Session Notes</h4>
                      <p className="text-sm text-muted-foreground bg-gray-50 p-3 rounded-lg">{booking.notes}</p>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    {booking.status === "completed" && booking.meetingUrl && (
                      <Button asChild className="flex-1">
                        <a href={booking.meetingUrl} target="_blank" rel="noopener noreferrer">
                          <Video className="h-4 w-4 mr-2" />
                          Join Meeting
                        </a>
                      </Button>
                    )}
                    <Button variant="outline" className="flex-1 bg-transparent">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message Mentor
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="text-center py-12">
        <CalendarIcon className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Sessions Booked</h3>
        <p className="text-muted-foreground mb-6">
          Book your first 1-on-1 session to get personalized guidance
        </p>
        <Button onClick={() => setActiveTab("available")}>
          <Plus className="h-4 w-4 mr-2" />
          Browse Available Sessions
        </Button>
      </CardContent>
    </Card>
  )
}