import ClientSessionsView from "./components/client-sessions-view"
import { sessionService } from "@/lib/services"

export default async function CreatorSessionsPage() {
  // Fetch real data from API
  const [sessionsData, bookingsData] = await Promise.all([
    sessionService.getMyCreatedSessions().catch(() => []),
    sessionService.getCreatorBookings().catch(() => []),
  ])
  
  // Transform API data to match component expectations
  const allSessions = sessionsData.map((session: any) => ({
    ...session,
    id: session._id || session.id,
  }))
  
  const allBookings = bookingsData.map((booking: any) => ({
    ...booking,
    id: booking._id || booking.id,
  }))

  return (
    <ClientSessionsView allSessions={allSessions} allBookings={allBookings} />
  )
}

