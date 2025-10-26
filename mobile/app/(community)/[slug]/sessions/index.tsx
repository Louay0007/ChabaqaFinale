import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, ActivityIndicator, Text, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { ThemedView } from '../../../../_components/ThemedView';
import { 
  Session,
  SessionBooking,
  getSessionsByCommunity,
  getUserBookings,
  bookSession,
  cancelBooking,
  convertSessionForUI,
  convertBookingForUI,
  formatSessionDateTime,
  formatSessionPrice,
  getBookingStatusColor,
  getBookingStatusLabel,
  canCancelBooking
} from '../../../../lib/session-api';
import { useAuth } from '../../../../hooks/use-auth';
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
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  
  // State management
  const [activeTab, setActiveTab] = useState<string>('available');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [sessionNotes, setSessionNotes] = useState<string>('');
  
  // API data state
  const [availableSessions, setAvailableSessions] = useState<Session[]>([]);
  const [userBookings, setUserBookings] = useState<SessionBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [booking, setBooking] = useState(false);
  
  // Load sessions data
  const loadSessions = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');

      console.log('📅 [SESSIONS] Loading sessions for community:', slug);

      // Fetch available sessions for this community
      const sessions = await getSessionsByCommunity(slug as string);
      setAvailableSessions(sessions);

      // Fetch user bookings if authenticated
      if (isAuthenticated) {
        const bookings = await getUserBookings();
        setUserBookings(bookings);
        console.log('✅ [SESSIONS] User bookings loaded:', bookings.length);
      }

      console.log('✅ [SESSIONS] Sessions loaded successfully:', sessions.length);
    } catch (err: any) {
      console.error('💥 [SESSIONS] Error loading sessions:', err);
      setError(err.message || 'Failed to load sessions');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [slug, isAuthenticated]);

  // Load on mount
  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Handle refresh
  const handleRefresh = () => {
    loadSessions(true);
  };
  
  // Convert sessions for UI compatibility
  const convertedSessions = availableSessions.map(convertSessionForUI);
  const convertedBookings = userBookings.map(booking => {
    const session = availableSessions.find(s => s.bookings?.some(b => b.id === booking.id));
    return convertBookingForUI(booking, session);
  });
  
  const totalSessionsBooked = userBookings.length;
  const totalAvailableTypes = availableSessions.length;
  const avgRating = availableSessions.reduce((sum, session) => sum + (session.average_rating || 0), 0) / (availableSessions.length || 1);
  
  const filteredSessions = convertedSessions.filter(session => 
    session.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.mentor.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const tabs: TabItem[] = [
    { key: 'available', title: 'Available' },
    { key: 'mysessions', title: `My Sessions (${userBookings.length})` },
    { key: 'calendar', title: 'Calendar' }
  ];

  const openBookingModal = (session: any) => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please login to book sessions',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Login', 
            onPress: () => router.push('/(auth)/signin')
          }
        ]
      );
      return;
    }
    
    setSelectedSession(session);
    setShowBookingModal(true);
    setSelectedDate(new Date());
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

  const handleBookingConfirm = async () => {
    if (!selectedSession || !selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please select a date and time for your session');
      return;
    }

    try {
      setBooking(true);
      
      // Create scheduled datetime
      const [hours, minutes] = selectedTime.split(':').map(Number);
      const scheduledAt = new Date(selectedDate);
      scheduledAt.setHours(hours, minutes, 0, 0);
      
      console.log('📝 [SESSIONS] Booking session:', selectedSession.id);
      
      await bookSession(selectedSession.id, {
        scheduled_at: scheduledAt.toISOString(),
        notes: sessionNotes
      });
      
      Alert.alert(
        'Success!',
        'Your session has been booked successfully',
        [{ text: 'OK', onPress: () => {
          closeBookingModal();
          loadSessions(true); // Refresh data
        }}]
      );
      
      console.log('✅ [SESSIONS] Session booked successfully');
    } catch (err: any) {
      console.error('💥 [SESSIONS] Booking error:', err);
      Alert.alert(
        'Booking Failed',
        err.message || 'Failed to book session. Please try again.'
      );
    } finally {
      setBooking(false);
    }
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const renderAvailableSession = ({ item }: { item: any }) => {
    return (
      <SessionCard
        session={item}
        mentor={item.mentor}
        onBookPress={openBookingModal}
      />
    );
  };

  const renderBookedSession = ({ item }: { item: any }) => {
    if (!item.sessionType) return null;
    
    return (
      <BookedSessionCard
        session={item}
        sessionType={item.sessionType}
        mentor={item.sessionType.mentor}
      />
    );
  };
  
  // Loading state
  if (loading && !refreshing) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#8e78fb" />
        <Text style={{ marginTop: 16, color: '#666', fontSize: 16 }}>Loading sessions...</Text>
      </ThemedView>
    );
  }

  // Error state
  if (error && !refreshing) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>⚠️</Text>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8 }}>Oops!</Text>
        <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 }}>
          {error}
        </Text>
        <TouchableOpacity
          onPress={() => loadSessions()}
          style={{
            backgroundColor: '#8e78fb',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Try Again</Text>
        </TouchableOpacity>
      </ThemedView>
    );
  }

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
        bookedSessionsCount={userBookings.length}
        availableSessionsCount={filteredSessions.length}
      />
      
      {activeTab === 'available' && (
        <FlatList
          data={filteredSessions}
          renderItem={renderAvailableSession}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.sessionsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#8e78fb"
              colors={['#8e78fb']}
            />
          }
        />
      )}
      
      {activeTab === 'mysessions' && (
        <FlatList
          data={convertedBookings}
          renderItem={renderBookedSession}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.sessionsList}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#8e78fb"
              colors={['#8e78fb']}
            />
          }
        />
      )}
      
      {activeTab === 'calendar' && (
        <CalendarView
          currentDate={currentDate}
          bookedSessions={convertedBookings}
          sessionTypes={convertedSessions}
          mentors={convertedSessions.map(s => s.mentor)}
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
        booking={booking}
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
