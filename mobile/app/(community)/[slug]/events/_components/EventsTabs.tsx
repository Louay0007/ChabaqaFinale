import { Event, EventRegistration } from '@/lib/mock-data';
import { Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';
import AvailableEventsTab from './AvailableEventsTab';
import CalendarTab from './CalendarTab';
import MyTicketsTab from './MyTicketsTab';

interface EventsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  availableEvents: Event[];
  myTickets: EventRegistration[];
}

export default function EventsTabs({
  activeTab,
  setActiveTab,
  availableEvents,
  myTickets
}: EventsTabsProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtrer les événements en fonction de la recherche
  const filteredEvents = availableEvents.filter(event => 
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'available':
        return <AvailableEventsTab availableEvents={filteredEvents} />;
      case 'mytickets':
        return <MyTicketsTab myTickets={myTickets} setActiveTab={setActiveTab} />;
      case 'calendar':
        return <CalendarTab myTickets={myTickets} availableEvents={availableEvents} />;
      default:
        return <AvailableEventsTab availableEvents={filteredEvents} />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Search Bar - Style identique à Sessions */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={16} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search events..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9ca3af"
          />
        </View>
      </View>

      {/* Tabs - Style identique à Sessions avec couleurs Events */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'available' && styles.activeTab]}
            onPress={() => setActiveTab('available')}
          >
            <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>
              Available ({filteredEvents.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'mytickets' && styles.activeTab]}
            onPress={() => setActiveTab('mytickets')}
          >
            <Text style={[styles.tabText, activeTab === 'mytickets' && styles.activeTabText]}>
              My Tickets ({myTickets.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, activeTab === 'calendar' && styles.activeTab]}
            onPress={() => setActiveTab('calendar')}
          >
            <Text style={[styles.tabText, activeTab === 'calendar' && styles.activeTabText]}>
              Calendar
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.tabContent}>
        {renderTabContent()}
      </View>
    </View>
  );
}
