import React from "react";
import EventsPageContent from "@/app/(community)/[creator]/[feature]/(loggedUser)/events/components/events-page-content";
import { myTickets, availableEvents } from "@/lib/mock-data";

export default function EventsPage() {
  return (
    <EventsPageContent 
      availableEvents={availableEvents}
      myTickets={myTickets}
    />
  );
}