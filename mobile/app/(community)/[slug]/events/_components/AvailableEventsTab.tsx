import { Event } from '@/lib/mock-data';
import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { styles } from '../styles';
import EventCard from './EventCard';

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
    // Here you would typically make an API call to register for the event
    // Reset form after registration
    setSelectedEvent(null);
    setSelectedTicket("");
    setQuantity(1);
    setNotes("");
  };

  const renderEventCard = ({ item }: { item: Event }) => (
    <EventCard
      event={item}
      selectedTicket={selectedTicket}
      setSelectedTicket={setSelectedTicket}
      quantity={quantity}
      setQuantity={setQuantity}
      notes={notes}
      setNotes={setNotes}
      setSelectedEvent={setSelectedEvent}
      handleRegister={handleRegister}
    />
  );

  return (
    <FlatList
      data={availableEvents}
      renderItem={renderEventCard}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      style={styles.availableEventsContainer}
    />
  );
}
