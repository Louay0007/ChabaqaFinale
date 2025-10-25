import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Mentor } from '../../../../../../lib/session-utils';

interface MentorCardProps {
  mentor: Mentor;
}

export const MentorCard: React.FC<MentorCardProps> = ({ mentor }) => {
  return (
    <View style={localStyles.mentorCard}>
      <Image source={{ uri: mentor.avatar }} style={localStyles.mentorAvatar} />
      <View style={localStyles.mentorInfo}>
        <Text style={localStyles.mentorName}>{mentor.name}</Text>
        <Text style={localStyles.mentorTitle}>{mentor.title}</Text>
        <View style={localStyles.mentorRating}>
          <Text style={localStyles.ratingText}>⭐ {mentor.rating.toFixed(1)}</Text>
          <Text style={localStyles.reviewsText}>({mentor.reviews} reviews)</Text>
        </View>
        <View style={localStyles.expertiseContainer}>
          <Text style={localStyles.reviewsText}>{mentor.bio}</Text>
        </View>
      </View>
      <TouchableOpacity style={localStyles.contactButton}>
        <Text style={localStyles.contactButtonText}>Contact</Text>
      </TouchableOpacity>
    </View>
  );
};

const localStyles = StyleSheet.create({
  mentorCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  mentorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  mentorInfo: {
    flex: 1,
  },
  mentorName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  mentorTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  mentorRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 14,
    marginRight: 8,
  },
  reviewsText: {
    fontSize: 12,
    color: '#666',
  },
  expertiseContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  expertiseTag: {
    backgroundColor: '#e0e0e0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    marginRight: 4,
    marginBottom: 4,
  },
  contactButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  contactButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
