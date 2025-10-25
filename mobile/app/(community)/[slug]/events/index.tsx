import { useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, RefreshControl } from 'react-native';
import { ThemedView } from '../../../../_components/ThemedView';
import { 
  Event,
  getEventsByCommunity,
  getMyRegisteredEvents,
  isRegisteredForEvent
} from '../../../../lib/event-api';
import { useAuth } from '../../../../hooks/use-auth';
import BottomNavigation from '../../_components/BottomNavigation';
import EventsPageContent from './_components/EventsPageContent';
import { styles } from './styles';

export default function EventsPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { isAuthenticated } = useAuth();
  
  // State management
  const [availableEvents, setAvailableEvents] = useState<Event[]>([]);
  const [myTickets, setMyTickets] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [communityId, setCommunityId] = useState<string>('');

  // Set community ID from slug
  useEffect(() => {
    setCommunityId(slug as string);
  }, [slug]);

  // Load events
  const loadEvents = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');

      console.log('🎉 [EVENTS] Loading events for community:', slug);

      // Fetch all events for this community
      const response = await getEventsByCommunity(communityId || '', {
        page: 1,
        limit: 50,
      });

      setAvailableEvents(response.events);

      // Fetch user's registered events if authenticated
      if (isAuthenticated) {
        const registered = await getMyRegisteredEvents();
        setMyTickets(registered);
        console.log('✅ [EVENTS] Registered events loaded:', registered.length);
      }

      console.log('✅ [EVENTS] Events loaded successfully:', response.events.length);
    } catch (err: any) {
      console.error('💥 [EVENTS] Error loading events:', err);
      setError(err.message || 'Failed to load events');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [communityId, isAuthenticated, slug]);

  // Load on mount
  useEffect(() => {
    if (communityId) {
      loadEvents();
    }
  }, [communityId, loadEvents]);

  // Handle refresh
  const handleRefresh = () => {
    loadEvents(true);
  };

  // Loading state
  if (loading && !refreshing) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#8e78fb" />
        <Text style={{ marginTop: 16, color: '#666', fontSize: 16 }}>Loading events...</Text>
        <BottomNavigation slug={slug as string} currentTab="events" />
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
          onPress={() => loadEvents()}
          style={{
            backgroundColor: '#8e78fb',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Try Again</Text>
        </TouchableOpacity>
        <BottomNavigation slug={slug as string} currentTab="events" />
      </ThemedView>
    );
  }

  // Helper function to convert event type
  const convertEventType = (type: string): 'Online' | 'In-person' | 'Hybrid' => {
    switch (type) {
      case 'online': return 'Online';
      case 'in-person': return 'In-person';
      case 'hybrid': return 'Hybrid';
      default: return 'Online';
    }
  };

  // Convert API events to component-compatible format
  const convertedEvents = availableEvents.map(event => ({
    ...event,
    id: event._id,
    image: event.cover_image || event.thumbnail || '',
    communityId: event.community_id?._id || '',
    creatorId: event.created_by._id,
    type: convertEventType(event.type),
    creator: {
      ...event.created_by,
      id: event.created_by._id,
      role: 'creator' as const,
      verified: true,
      communities: [],
      createdAt: new Date(event.created_at),
      updatedAt: new Date(event.updated_at)
    },
    startDate: new Date(event.start_date),
    endDate: new Date(event.end_date),
    startTime: event.start_time || event.start_date,
    endTime: event.end_time || event.end_date,
    participantsCount: event.attendees_count,
    currentAttendees: event.attendees_count,
    maxParticipants: event.max_attendees,
    isActive: event.is_active,
    isPublished: event.is_published,
    location: event.location || '',
    tickets: event.tickets || [],
    createdAt: event.created_at,
    updatedAt: event.updated_at
  }));

  // Convert registered events to ticket format
  const convertedTickets = myTickets.map(event => ({
    id: event._id,
    eventId: event._id,
    event: {
      ...event,
      id: event._id,
      image: event.cover_image || event.thumbnail || '',
      communityId: event.community_id?._id || '',
      creatorId: event.created_by._id,
      type: convertEventType(event.type),
      creator: {
        ...event.created_by,
        id: event.created_by._id,
        role: 'creator' as const,
        verified: true,
        communities: [],
        createdAt: new Date(event.created_at),
        updatedAt: new Date(event.updated_at)
      },
      startDate: new Date(event.start_date),
      endDate: new Date(event.end_date),
      startTime: event.start_time || event.start_date,
      endTime: event.end_time || event.end_date,
      participantsCount: event.attendees_count,
      currentAttendees: event.attendees_count,
      maxParticipants: event.max_attendees,
      isActive: event.is_active,
      isPublished: event.is_published,
      location: event.location || '',
      tickets: event.tickets || [],
      createdAt: event.created_at,
      updatedAt: event.updated_at
    },
    userId: 'current-user',
    user: {
      id: 'current-user',
      name: 'Current User',
      email: 'user@example.com',
      role: 'member' as const,
      verified: true,
      communities: [],
      createdAt: new Date(),
      updatedAt: new Date()
    },
    registeredAt: new Date().toISOString(),
    ticketType: 'general',
    ticketId: 'ticket-' + event._id,
    ticket: {
      id: 'ticket-' + event._id,
      name: 'General Admission',
      price: 0,
      currency: 'USD'
    },
    quantity: 1,
    totalAmount: 0,
    currency: 'USD',
    paymentStatus: 'completed' as const,
    status: 'confirmed' as const,
    qrCode: 'sample-qr-code',
    updatedAt: new Date().toISOString()
  }));

  return (
    <ThemedView style={styles.container}>
      <EventsPageContent 
        availableEvents={convertedEvents as any}
        myTickets={convertedTickets as any}
      />
      <BottomNavigation slug={slug as string} currentTab="events" />
    </ThemedView>
  );
}
