import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList } from 'react-native';
import { ThemedView } from '../../../../_components/ThemedView';
import { ThemedText } from '../../../../_components/ThemedText';
import { getAvailableMentors, getAvailableSessionTypes, getBookedSessionsByUser, Mentor } from '../../../../lib/session-utils';
import { getSessionsByCommunity, getUserBookings, convertSessionForUI, convertBookingForUI } from '../../../../lib/session-api';
import { getCommunityBySlug } from '../../../../lib/communities-api';
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
  
  // Real data state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [community, setCommunity] = useState<any>(null);
  const [sessionTypes, setSessionTypes] = useState<any[]>([]);
  const [bookedSessions, setBookedSessions] = useState<any[]>([]);
  const [mentors, setMentors] = useState<any[]>([]);
  
  // Fetch data on component mount
  useEffect(() => {
    fetchSessionsData();
  }, [slug]);
  
  const fetchSessionsData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📚 Fetching sessions for community:', slug);

      // Fetch community data first
      const communityResponse = await getCommunityBySlug(slug || '');
      if (!communityResponse.success || !communityResponse.data) {
        throw new Error('Community not found');
      }
      
      const communityData = {
        id: communityResponse.data._id || communityResponse.data.id,
        name: communityResponse.data.name,
        slug: communityResponse.data.slug,
      };
      setCommunity(communityData);
      
      // Fetch sessions for this community
      const communitySlug = slug as string;
      const sessionsResponse = await getSessionsByCommunity(communitySlug);
      
      // Transform backend sessions to match frontend interface
      const transformedSessions = sessionsResponse.map((session: any) => convertSessionForUI(session));
      setSessionTypes(transformedSessions);
      
      // Extract unique mentors from sessions
      const uniqueMentors = transformedSessions.reduce((acc: any[], session: any) => {
        const existingMentor = acc.find(m => m.id === session.mentor.id);
        if (!existingMentor) {
          acc.push(session.mentor);
        }
        return acc;
      }, []);
      setMentors(uniqueMentors);
      
      // Fetch user's booked sessions
      try {
        const userBookingsResponse = await getUserBookings();
        const transformedBookings = userBookingsResponse.map((booking: any) => {
          const relatedSession = transformedSessions.find(s => s.id === booking.sessionTypeId);
          return convertBookingForUI(booking, relatedSession);
        });
        setBookedSessions(transformedBookings);
      } catch (bookingError) {
        console.warn('⚠️ Could not fetch user bookings:', bookingError);
        setBookedSessions([]);
      }
      
      console.log('✅ Sessions loaded:', transformedSessions.length);
    } catch (err: any) {
      console.error('❌ Error fetching sessions:', err);
      setError(err.message || 'Failed to load sessions');
      
      // Fallback to mock data
      console.log('⚠️ Falling back to mock data');
      const mockSessionTypes = getAvailableSessionTypes();
      const mockMentors = getAvailableMentors();
      const mockBookedSessions = getBookedSessionsByUser("2");
      
      setSessionTypes(mockSessionTypes);
      setMentors(mockMentors);
      setBookedSessions(mockBookedSessions);
    } finally {
      setLoading(false);
    }
  };
  
  const totalSessionsBooked = bookedSessions.length;
  const totalAvailableTypes = sessionTypes.length;
  const avgRating = mentors.length > 0 ? mentors.reduce((sum, mentor) => sum + mentor.rating, 0) / mentors.length : 0;
  
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

  if (loading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#8e78fb" />
        <ThemedText style={{ marginTop: 16, opacity: 0.7 }}>Loading sessions...</ThemedText>
      </ThemedView>
    );
  }

  if (error) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText style={{ color: '#ef4444', textAlign: 'center', margin: 20 }}>
          {error}
        </ThemedText>
        <ThemedText style={{ textAlign: 'center', opacity: 0.7 }}>
          Community: {slug}
        </ThemedText>
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
