import { ThemedText } from '@/_components/ThemedText';
import { EventRegistration } from '@/lib/mock-data';
import React from 'react';
import { FlatList, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MyTicketsTabProps {
  myTickets: EventRegistration[];
  setActiveTab: (tab: string) => void;
}

export default function MyTicketsTab({ myTickets, setActiveTab }: MyTicketsTabProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleJoinOnlineEvent = (url: string) => {
    // Always force Google Meet instead of using the provided URL
    const googleMeetUrl = 'https://meet.google.com/';
    
    Linking.canOpenURL(googleMeetUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(googleMeetUrl);
        } else {
          // Fallback to opening in browser
          return Linking.openURL('https://meet.google.com/');
        }
      })
      .catch((err) => {
        console.error('Failed to open Google Meet:', err);
        // Last fallback - open Google Meet homepage
        Linking.openURL('https://meet.google.com/');
      });
  };

  const renderTicket = ({ item }: { item: EventRegistration }) => (
    <View style={styles.ticketCard}>
      <View style={styles.ticketHeader}>
        <View style={styles.ticketInfo}>
          <ThemedText style={styles.eventTitle}>{item.event.title}</ThemedText>
          <ThemedText style={styles.ticketName}>{item.ticket.name}</ThemedText>
        </View>
        <View style={[styles.statusBadge, getStatusBadgeStyle(item.status)]}>
          <Text style={[styles.statusText, getStatusTextStyle(item.status)]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>

      <View style={styles.ticketDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.icon}>📅</Text>
          <ThemedText style={styles.detailText}>
            {formatDate(item.event.startDate)} – {item.event.location}
          </ThemedText>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.icon}>🎫</Text>
          <ThemedText style={styles.detailText}>
            Quantity: {item.quantity} × ${item.ticket.price} = ${item.totalAmount}
          </ThemedText>
        </View>

        {item.notes && (
          <View style={styles.detailRow}>
            <Text style={styles.icon}>📝</Text>
            <ThemedText style={styles.detailText}>{item.notes}</ThemedText>
          </View>
        )}
      </View>

      {item.event.type !== "In-person" && (
        <TouchableOpacity
          style={styles.joinButton}
          onPress={() => handleJoinOnlineEvent(item.event.onlineUrl || '')}
        >
          <Text style={styles.joinButtonIcon}>📹</Text>
          <Text style={styles.joinButtonText}>Join Event Online</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { backgroundColor: '#d1fae5' };
      case 'pending':
        return { backgroundColor: '#fef3c7' };
      case 'cancelled':
        return { backgroundColor: '#fee2e2' };
      case 'attended':
        return { backgroundColor: '#dbeafe' };
      default:
        return { backgroundColor: '#f3f4f6' };
    }
  };

  const getStatusTextStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { color: '#065f46' };
      case 'pending':
        return { color: '#92400e' };
      case 'cancelled':
        return { color: '#991b1b' };
      case 'attended':
        return { color: '#1e40af' };
      default:
        return { color: '#374151' };
    }
  };

  if (myTickets.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🎫</Text>
        <ThemedText style={styles.emptyTitle}>No Tickets Yet</ThemedText>
        <ThemedText style={styles.emptySubtitle}>Register for your first event</ThemedText>
        <TouchableOpacity
          style={styles.browseButton}
          onPress={() => setActiveTab("available")}
        >
          <Text style={styles.browseButtonIcon}>+</Text>
          <Text style={styles.browseButtonText}>Browse Events</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={myTickets}
      renderItem={renderTicket}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  separator: {
    height: 16,
  },
  ticketCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  ticketInfo: {
    flex: 1,
    marginRight: 12,
  },
  eventTitle: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 6,
    color: '#111827',
  },
  ticketName: {
    fontSize: 15,
    color: '#4b5563',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  ticketDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
    width: 20,
  },
  detailText: {
    fontSize: 15,
    color: '#374151',
    flex: 1,
    lineHeight: 22,
    fontWeight: '500',
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  joinButtonIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  joinButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    color: '#111827',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#4b5563',
    marginBottom: 24,
    fontWeight: '500',
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#9333ea',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  browseButtonIcon: {
    fontSize: 16,
    color: '#ffffff',
    marginRight: 8,
  },
  browseButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 14,
  },
});
