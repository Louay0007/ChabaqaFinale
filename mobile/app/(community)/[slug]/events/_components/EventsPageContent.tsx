import { Event, EventRegistration } from '@/lib/mock-data';
import React, { useState } from 'react';
import { View } from 'react-native';
import { styles } from '../styles';
import EventsHeader from './EventsHeader';
import EventsTabs from './EventsTabs';

interface EventsPageContentProps {
  availableEvents: Event[];
  myTickets: EventRegistration[];
}

export default function EventsPageContent({ 
  availableEvents, 
  myTickets 
}: EventsPageContentProps) {
  const [activeTab, setActiveTab] = useState("available");

  return (
    <View style={styles.contentContainer}>
      <EventsHeader availableEvents={availableEvents} myTickets={myTickets} />
      <EventsTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        availableEvents={availableEvents}
        myTickets={myTickets}
      />
    </View>
  );
}
