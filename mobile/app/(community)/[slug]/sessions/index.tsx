import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { FlatList } from 'react-native';
import { ThemedView } from '../../../../_components/ThemedView';
import { getAvailableMentors, getAvailableSessionTypes, getBookedSessionsByUser, Mentor } from '../../../../lib/session-utils';
import BottomNavigation from '../../_components/BottomNavigation';
import { BookedSessionCard } from './_components/BookedSessionCard';
import { BookingModal } from './_components/BookingModal';
import { CalendarView } from './_components/CalendarView';
import { SearchBar } from './_components/SearchBar';
import { SessionCard, SessionType } from './_components/SessionCard';
import { SessionsHeader } from './_components/SessionsHeader';
import { SessionsTabs, TabItem } from './_components/SessionsTabs';
import { styles } from './styles';

export default function SessionsScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState<string>('available');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentDate, setCurrentDate] = useState(new Date(2025, 8, 3)); // September 2025
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<SessionType | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [sessionNotes, setSessionNotes] = useState<string>('');
  
  const sessionTypes = getAvailableSessionTypes();
  const mentors = getAvailableMentors();
  const bookedSessions = getBookedSessionsByUser("2");
  
  const totalSessionsBooked = bookedSessions.length;
  const totalAvailableTypes = sessionTypes.length;
  const avgRating = mentors.reduce((sum, mentor) => sum + mentor.rating, 0) / mentors.length;
  
  const filteredSessions = sessionTypes.filter(session => 
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.mentor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs: TabItem[] = [
    { key: 'available', title: 'Available' },
    { key: 'mysessions', title: `My Sessions (${bookedSessions.length})` },
    { key: 'calendar', title: 'Calendar' }
  ];

  const openBookingModal = (session: SessionType) => {
    setSelectedSession(session);
    setShowBookingModal(true);
    setSelectedDate(new Date(2025, 8, 3));
    setSelectedTime('09:00');
    setSessionNotes('');
  };

  const closeBookingModal = () => {
    console.log('Closing booking modal');
    setShowBookingModal(false);
    setSelectedSession(null);
    setSelectedDate(null);
    setSelectedTime('');
    setSessionNotes('');
  };

  const handleBookingConfirm = () => {
    console.log('Booking confirmed:', {
      session: selectedSession,
      date: selectedDate,
      time: selectedTime,
      notes: sessionNotes
    });
    closeBookingModal();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderAvailableSession = ({ item }: { item: SessionType }) => {
    const mentor = mentors.find((m: Mentor) => m.id === item.mentor.id);
    return (
      <SessionCard
        session={item}
        mentor={mentor}
        onBookPress={openBookingModal}
      />
    );
  };

  const renderBookedSession = ({ item }: { item: any }) => {
    const sessionType = sessionTypes.find(s => s.id === item.sessionTypeId);
    const mentor = sessionType ? mentors.find(m => m.id === sessionType.mentor.id) : null;
    
    if (!sessionType || !mentor) return null;
    
    return (
      <BookedSessionCard
        session={item}
        sessionType={sessionType}
        mentor={mentor}
      />
    );
  };

  return (
    <ThemedView style={styles.container}>
      <SessionsHeader
        totalBooked={totalSessionsBooked}
        totalAvailable={totalAvailableTypes}
        avgRating={avgRating}
      />
      
      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <SessionsTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabPress={setActiveTab}
        bookedSessionsCount={bookedSessions.length}
        availableSessionsCount={filteredSessions.length}
      />
      
      {activeTab === 'available' && (
        <FlatList
          data={filteredSessions}
          renderItem={renderAvailableSession}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.sessionsList}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      {activeTab === 'mysessions' && (
        <FlatList
          data={bookedSessions}
          renderItem={renderBookedSession}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.sessionsList}
          showsVerticalScrollIndicator={false}
        />
      )}
      
      {activeTab === 'calendar' && (
        <CalendarView
          currentDate={currentDate}
          bookedSessions={bookedSessions}
          sessionTypes={sessionTypes}
          mentors={mentors}
          onPreviousMonth={previousMonth}
          onNextMonth={nextMonth}
        />
      )}

      <BookingModal
        visible={showBookingModal}
        selectedSession={selectedSession}
        currentDate={currentDate}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
        sessionNotes={sessionNotes}
        onClose={closeBookingModal}
        onConfirm={handleBookingConfirm}
        onDateSelect={setSelectedDate}
        onTimeSelect={setSelectedTime}
        onNotesChange={setSessionNotes}
        onPreviousMonth={previousMonth}
        onNextMonth={nextMonth}
      />
      
      <BottomNavigation slug={slug as string} currentTab="sessions" />
    </ThemedView>
  );
}
