import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator } from 'react-native';
import { ThemedView } from '../../../../_components/ThemedView';
import { ThemedText } from '../../../../_components/ThemedText';
import { availableEvents as mockEvents, myTickets as mockTickets } from '../../../../lib/mock-data';
import { getCommunityBySlug } from '../../../../lib/communities-api';
import { getEventsByCommunity, getMyRegisteredEvents, Event as BackendEvent } from '../../../../lib/event-api';
import BottomNavigation from '../../_components/BottomNavigation';
import EventsPageContent from './_components/EventsPageContent';
import { styles } from './styles';

export default function EventsPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [community, setCommunity] = useState<any>(null);
  const [availableEvents, setAvailableEvents] = useState<any[]>([]);
  const [myTickets, setMyTickets] = useState<any[]>([]);

  // Fetch community and events data
  useEffect(() => {
    fetchEventsData();
  }, [slug]);

  const fetchEventsData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🎉 Fetching events for community:', slug);

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
      
      // Fetch events for this community
      const eventsResponse = await getEventsByCommunity(communityData.id, {
        page: 1,
        limit: 50,
        isActive: true
      });
      
      // Transform backend events to match frontend interface
      const transformedEvents = eventsResponse.events.map((event: BackendEvent) => ({
        id: event._id,
        title: event.title,
        description: event.description,
        shortDescription: event.short_description || event.description,
        image: event.thumbnail || event.cover_image || 'https://via.placeholder.com/400x300',
        communityId: communityData.id,
        creatorId: event.created_by._id,
        creator: event.created_by,
        startDate: new Date(event.start_date),
        endDate: event.end_date ? new Date(event.end_date) : undefined,
        startTime: event.start_time,
        endTime: event.end_time,
        location: event.location,
        type: event.type,
        isActive: event.is_active,
        isPublished: event.is_published,
        maxAttendees: event.max_attendees,
        attendeesCount: event.attendees_count,
        tickets: event.tickets || [],
        sessions: event.sessions || [],
        speakers: event.speakers || [],
        tags: event.tags || [],
        category: event.category,
        venue: event.venue,
        createdAt: new Date(event.created_at),
        updatedAt: new Date(event.updated_at),
      }));
      
      setAvailableEvents(transformedEvents);
      
      // Fetch user's registered events
      try {
        const registeredEvents = await getMyRegisteredEvents();
        const transformedTickets = registeredEvents.map(event => ({
          id: Date.now().toString() + Math.random(),
          eventId: event._id,
          event: {
            ...event,
            id: event._id,
            startDate: new Date(event.start_date),
            endDate: event.end_date ? new Date(event.end_date) : undefined,
          },
          userId: 'current-user',
          ticketId: 'general',
          ticket: {
            id: 'general',
            eventId: event._id,
            name: 'General Admission',
            description: 'Standard event access',
            price: 0,
            currency: 'TND',
            maxQuantity: 100,
            sold: 0,
            isActive: true,
            benefits: ['Event access', 'Networking opportunities']
          },
          quantity: 1,
          totalAmount: 0,
          currency: 'TND',
          status: 'confirmed' as const,
          registeredAt: new Date(),
          updatedAt: new Date()
        }));
        setMyTickets(transformedTickets);
      } catch (registrationError) {
        console.warn('⚠️ Could not fetch user registrations:', registrationError);
        setMyTickets([]);
      }
      
      console.log('✅ Events loaded:', transformedEvents.length);
    } catch (err: any) {
      console.error('❌ Error fetching events:', err);
      setError(err.message || 'Failed to load events');
      
      // Fallback to mock data
      console.log('⚠️ Falling back to mock data');
      setAvailableEvents(mockEvents);
      setMyTickets(mockTickets);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#8e78fb" />
        <ThemedText style={{ marginTop: 16, opacity: 0.7 }}>Loading events...</ThemedText>
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
      <EventsPageContent 
        availableEvents={availableEvents}
        myTickets={myTickets}
      />
      <BottomNavigation slug={slug as string} currentTab="events" />
    </ThemedView>
  );
}
