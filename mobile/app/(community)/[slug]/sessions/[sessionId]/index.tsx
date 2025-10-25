import BackButton from '@/_components/BackButton';
import { ThemedText } from '@/_components/ThemedText';
import { ThemedView } from '@/_components/ThemedView';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { getMentorById, getSessionTypeById } from '../../../../../lib/session-utils';
import { styles } from '../styles';
import { BookingButton } from './_components/BookingButton';
import { DateTimeOption, DateTimeSelector } from './_components/DateTimeSelector';
import { MentorCard } from './_components/MentorCard';
import { SessionDescription } from './_components/SessionDescription';
import { SessionHeader } from './_components/SessionHeader';
import { SessionMetadata } from './_components/SessionMetadata';

export default function SessionDetailScreen() {
  const router = useRouter();
  const { slug, sessionId } = useLocalSearchParams<{ slug: string; sessionId: string }>();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  
  const sessionType = getSessionTypeById(sessionId);
  const mentor = sessionType ? getMentorById(sessionType.mentor.id) : null;
  
  // Mock date options for booking
  const dateOptions: DateTimeOption[] = [
    { id: '1', date: 'Mon, 15 Jul', time: '10:00 AM', available: true },
    { id: '2', date: 'Mon, 15 Jul', time: '2:00 PM', available: true },
    { id: '3', date: 'Tue, 16 Jul', time: '11:00 AM', available: true },
    { id: '4', date: 'Tue, 16 Jul', time: '3:00 PM', available: false },
    { id: '5', date: 'Wed, 17 Jul', time: '9:00 AM', available: true },
    { id: '6', date: 'Wed, 17 Jul', time: '1:00 PM', available: true },
    { id: '7', date: 'Thu, 18 Jul', time: '10:00 AM', available: false },
    { id: '8', date: 'Thu, 18 Jul', time: '4:00 PM', available: true },
  ];
  
  const handleBackToHome = () => {
    router.replace(`/(community)/${slug}/(loggedUser)/home`);
  };
  
  const handleBookSession = () => {
    if (selectedDate) {
      // In a real app, this would make an API call to book the session
      // For now, we'll just navigate back to the sessions list
      router.push(`/(community)/${slug}/sessions`);
    }
  };
  
  if (!sessionType || !mentor) {
    return (
      <ThemedView style={styles.container}>
        <BackButton onPress={handleBackToHome} />
        <ThemedText style={styles.notFound}>Session not found</ThemedText>
      </ThemedView>
    );
  }
  
  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SessionHeader 
          onBack={handleBackToHome} 
          title={sessionType.title} 
        />
        
        <SessionMetadata 
          duration={sessionType.duration} 
          price={sessionType.price} 
        />
        
        <SessionDescription description={sessionType.description} />
        
        <MentorCard mentor={mentor} />
        
        <DateTimeSelector
          dateOptions={dateOptions}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />
        
        <BookingButton
          onBook={handleBookSession}
          disabled={!selectedDate}
        />
      </ScrollView>
    </ThemedView>
  );
}
