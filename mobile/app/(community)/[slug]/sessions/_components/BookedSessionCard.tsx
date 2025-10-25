import React from 'react';
import { Image, Linking, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../../../../_components/ThemedText';
import { Mentor } from '../../../../../lib/session-utils';
import { styles } from '../styles';
import { SessionType } from './SessionCard';

export interface BookedSession {
  id: string;
  sessionTypeId: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  scheduledAt: string;
  notes?: string;
  meetingUrl?: string;
}

interface BookedSessionCardProps {
  session: BookedSession;
  sessionType: SessionType;
  mentor: Mentor;
}

export const BookedSessionCard: React.FC<BookedSessionCardProps> = ({
  session,
  sessionType,
  mentor,
}) => {
  const getBadgeStyle = (status: string) => {
    switch (status) {
      case 'confirmed':
        return styles.confirmedBadge;
      case 'pending':
        return styles.pendingBadge;
      case 'completed':
        return styles.completedBadge;
      case 'cancelled':
        return styles.pendingBadge; // Using pending style for cancelled
      default:
        return styles.pendingBadge;
    }
  };

  const handleJoinGoogleMeet = () => {
    // Always force Google Meet instead of using the provided meeting URL
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

  return (
    <View style={styles.bookedSessionCard}>
      <View style={styles.sessionHeader}>
        <ThemedText style={styles.sessionTitle}>{sessionType.title}</ThemedText>
        <View style={[styles.statusBadge, getBadgeStyle(session.status)]}>
          <ThemedText style={styles.statusText}>
            {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
          </ThemedText>
        </View>
      </View>
      
      <View style={styles.mentorSection}>
        <View style={styles.mentorInfo}>
          {mentor.avatar ? (
            <Image source={{ uri: mentor.avatar }} style={styles.mentorAvatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <ThemedText style={styles.avatarInitial}>{mentor.name.charAt(0)}</ThemedText>
            </View>
          )}
          <ThemedText style={styles.mentorName}>{mentor.name}</ThemedText>
        </View>
      </View>
      
      <View style={styles.sessionDetails}>
        <View style={styles.sessionDetailItem}>
          <ThemedText style={styles.sessionDetailLabel}>Date</ThemedText>
          <ThemedText style={styles.sessionDetailValue}>
            {new Date(session.scheduledAt).toLocaleDateString('fr-FR', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </ThemedText>
        </View>
        
        <View style={styles.sessionDetailItem}>
          <ThemedText style={styles.sessionDetailLabel}>Time</ThemedText>
          <ThemedText style={styles.sessionDetailValue}>
            {new Date(session.scheduledAt).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </ThemedText>
        </View>
        
        {session.notes && (
          <View style={styles.sessionDetailItem}>
            <ThemedText style={styles.sessionDetailLabel}>Notes</ThemedText>
            <ThemedText style={styles.sessionDetailValue}>{session.notes}</ThemedText>
          </View>
        )}
      </View>
      
      <View style={styles.bookedSessionActions}>
        <TouchableOpacity 
          style={styles.joinMeetingButton}
          onPress={handleJoinGoogleMeet}
        >
          <ThemedText style={styles.joinMeetingText}>📹 Join Metting</ThemedText>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.messageMentorButton}>
          <ThemedText style={styles.messageMentorText}>Message Mentor</ThemedText>
        </TouchableOpacity>
      </View>
    </View>
  );
};
