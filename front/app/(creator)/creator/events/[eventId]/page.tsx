import { getEventById, getEventSessions } from "@/lib/mock-data"
import EventHeader from "./components/EventHeader"
import EventTabs from "./components/EventTabs"

interface PageProps {
  params: { eventId: string }
}

export default async function ManageEventPage({ params }: PageProps) {
  const { eventId } = await params
  const event = getEventById(eventId)
  const eventSessions = getEventSessions(eventId)

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