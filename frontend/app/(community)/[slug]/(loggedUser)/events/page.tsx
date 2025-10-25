import React from "react";
import EventsPageContent from "@/app/(community)/[slug]/(loggedUser)/events/components/events-page-content";
import { communityService, eventService } from "@/lib/services";

export default async function EventsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // Fetch real data from APIs
  const [community, events] = await Promise.all([
    communityService.getCommunityBySlug(slug),
    eventService.getEventsByCommunity("").catch(() => []), // Get community ID first
  ]);
  
  // Fetch events with actual community ID
  const communityEvents = await eventService.getEventsByCommunity(community._id);
  
  // Transform to match component props
  const availableEvents: any = communityEvents.map((event) => ({
    id: event._id,
    title: event.title,
    description: event.description,
    date: event.startDate,
    time: event.startTime,
    location: event.location,
    type: event.type,
    price: 0, // TODO: Get from tickets
    category: event.category,
    image: event.image || "/placeholder.svg?height=200&width=300",
    attendees: event.attendeesCount || 0,
    startDate: event.startDate,
    endDate: event.endDate,
    startTime: event.startTime,
    endTime: event.endTime,
    timezone: event.timezone,
    onlineUrl: event.onlineUrl,
  }));
  
  // Mock tickets for now - TODO: implement ticket system
  const myTickets: any[] = [];
  
  return (
    <EventsPageContent 
      myTickets={myTickets} 
      availableEvents={availableEvents} 
    />
  );
}