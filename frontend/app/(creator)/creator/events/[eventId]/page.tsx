import EventHeader from "./components/EventHeader"
import EventTabs from "./components/EventTabs"
import { eventService } from "@/lib/services"

interface PageProps {
  params: Promise<{ eventId: string }>
}

export default async function ManageEventPage({ params }: PageProps) {
  const { eventId } = await params
  
  // Fetch real data from API
  const event = await eventService.getEventById(eventId).catch(() => null)
  const eventSessions = event?.sessions || []

  if (!event) {
    return <div>Event not found</div>
  }

  return (
    <div className="space-y-8 p-5">
      <EventHeader event={event} />
      <EventTabs event={event} sessions={eventSessions} />
    </div>
  )
}