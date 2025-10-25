import { EventsHeader } from "./components/events-header"
import { EventsStats } from "./components/events-stats"
import { EventsActionBar } from "./components/events-action-bar"
import { EventsList } from "./components/events-list"
import { eventService } from "@/lib/services"

export default async function EventsPage() {
  // Fetch real data from API
  const eventsData = await eventService.getMyCreatedEvents().catch(() => [])
  
  // Transform API data to match component expectations
  const events = eventsData.map((event: any) => ({
    ...event,
    id: event._id || event.id,
    attendees: event.attendees || event.participants || [],
    tickets: event.tickets || [],
    startDate: event.startDate || event.dateDebut,
  }))
  
  const upcomingEvents = events.filter(event => new Date(event.startDate) > new Date())
  const pastEvents = events.filter(event => new Date(event.startDate) <= new Date())

  const totalEvents = events.length
  const totalUpcoming = upcomingEvents.length
  const totalPast = pastEvents.length
  const totalAttendees = events.reduce((acc: number, event: any) => acc + (event.attendees?.length || 0), 0)
  const totalRevenue = events.reduce((acc: number, event: any) => 
    acc + (event.tickets?.reduce((sum: number, ticket: any) => sum + ((ticket.price || 0) * (ticket.sold || 0)), 0) || 0), 0)

  return (
    <div className="space-y-8 p-5">
      <EventsHeader />
      <EventsStats 
        totalEvents={totalEvents}
        totalAttendees={totalAttendees}
        totalRevenue={totalRevenue}
        totalUpcoming={totalUpcoming}
      />
      <EventsActionBar 
        activeTab="upcoming"
        totalUpcoming={totalUpcoming}
        totalPast={totalPast}
      />
      <EventsList 
        upcomingEvents={upcomingEvents}
        pastEvents={pastEvents}
      />
    </div>
  )
}