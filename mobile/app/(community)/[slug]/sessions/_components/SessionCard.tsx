import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../../../../_components/ThemedText';
import { Mentor } from '../../../../../lib/session-utils';
import { styles } from '../styles';

export interface SessionType {
  id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
  mentor: {
    id: string;
    name: string;
  };
}

interface SessionCardProps {
  session: SessionType;
  mentor?: Mentor;
  onBookPress: (session: SessionType) => void;
}

export const SessionCard: React.FC<SessionCardProps> = ({
  session,
  mentor,
  onBookPress,
}) => {
  return (
    <View style={styles.sessionCard}>
      <View style={styles.sessionHeader}>
        <View style={styles.sessionInfo}>
          <ThemedText style={styles.sessionTitle}>{session.title}</ThemedText>
          <ThemedText style={styles.sessionDuration}>{session.duration} minutes</ThemedText>
          <View style={styles.priceContainer}>
            <ThemedText style={styles.price}>${session.price}</ThemedText>
          </View>
        </View>
      </View>
      
      {mentor && (
        <View style={styles.mentorSection}>
          <View style={styles.mentorInfo}>
            {mentor.avatar ? (
              <Image source={{ uri: mentor.avatar }} style={styles.mentorAvatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <ThemedText style={styles.avatarInitial}>
                  {mentor.name.charAt(0)}
                </ThemedText>
              </View>
            )}
            <View>
              <ThemedText style={styles.mentorName}>{mentor.name}</ThemedText>
              <ThemedText style={styles.mentorTitle}>{mentor.title}</ThemedText>
            </View>
          </View>
        </View>
      )}
      
      <View style={styles.descriptionContainer}>
        <ThemedText numberOfLines={2} style={styles.description}>
          {session.description}
        </ThemedText>
      </View>
      
      <TouchableOpacity 
        style={styles.bookButton}
        onPress={() => onBookPress(session)}
      >
        <Text style={styles.bookButtonText}>Book Session</Text>
      </TouchableOpacity>
    </View>
  );
};
