"use client";

import { useState } from "react";
import { Event } from "@/lib/models";
import EventCard from "@/app/(community)/[creator]/[feature]/(loggedUser)/events/components/event-card";
import { TabsContent } from "@/components/ui/tabs";


interface AvailableEventsTabProps {
  availableEvents: Event[];
}

export default function AvailableEventsTab({ availableEvents }: AvailableEventsTabProps) {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState("");

  const handleRegister = () => {
    console.log("Registering:", { 
      event: selectedEvent?.id, 
      ticket: selectedTicket, 
      quantity, 
      notes 
    });
  };

  return (
    <TabsContent value="available" className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {availableEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            selectedTicket={selectedTicket}
            setSelectedTicket={setSelectedTicket}
            quantity={quantity}
            setQuantity={setQuantity}
            notes={notes}
            setNotes={setNotes}
            setSelectedEvent={setSelectedEvent}
            handleRegister={handleRegister}
          />
        ))}
      </div>
    </TabsContent>
  );
}