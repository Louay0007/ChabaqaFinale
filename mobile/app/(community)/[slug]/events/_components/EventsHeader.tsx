import { Event, EventRegistration } from '@/lib/mock-data';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../styles';

interface EventsHeaderProps {
  availableEvents: Event[];
  myTickets: EventRegistration[];
}

export default function EventsHeader({ availableEvents, myTickets }: EventsHeaderProps) {
  const totalTicketsSold = availableEvents.reduce(
    (acc, ev) => acc + ev.tickets.reduce((t, tk) => t + tk.sold, 0),
    0
  );

  return (
    <View style={styles.header}>
      {/* Background circles */}
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />
      
      <View style={styles.headerContent}>
        {/* Left side - Title and subtitle */}
        <View style={styles.titleSection}>
          <View style={styles.titleContainer}>
            <Text style={styles.icon}>✨</Text>
            <Text style={styles.title} numberOfLines={1}>Events</Text>
          </View>
          <Text style={styles.subtitle}>
            Discover and register for upcoming events
          </Text>
        </View>
        
        {/* Right side - Stats horizontal */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{availableEvents.length}</Text>
            <Text style={styles.statLabel}>Upcoming Events</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{myTickets.length}</Text>
            <Text style={styles.statLabel}>My Tickets</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalTicketsSold}</Text>
            <Text style={styles.statLabel}>Tickets Sold</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
