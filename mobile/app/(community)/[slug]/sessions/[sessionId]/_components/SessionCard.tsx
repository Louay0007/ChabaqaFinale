import { ThemedText } from '@/_components/ThemedText';
import React from 'react';
import { Image, View } from 'react-native';
import { styles } from '../../styles';

interface Mentor {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar?: string;
}

interface MentorCardProps {
  mentor: Mentor;
}

export const MentorCard: React.FC<MentorCardProps> = ({ mentor }) => {
  return (
    <View style={styles.sectionContainer}>
      <ThemedText style={styles.sectionTitle}>Your Mentor</ThemedText>
      <View style={styles.mentorCard}>
        <View style={styles.mentorHeader}>
          {mentor.avatar ? (
            <Image source={{ uri: mentor.avatar }} style={styles.mentorAvatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <ThemedText style={styles.avatarInitial}>{mentor.name.charAt(0)}</ThemedText>
            </View>
          )}
          <View style={styles.mentorInfo}>
            <ThemedText style={styles.mentorName}>{mentor.name}</ThemedText>
            <ThemedText style={styles.mentorTitle}>{mentor.title}</ThemedText>
          </View>
        </View>
        <ThemedText style={styles.mentorBio}>{mentor.bio}</ThemedText>
      </View>
    </View>
  );
};
