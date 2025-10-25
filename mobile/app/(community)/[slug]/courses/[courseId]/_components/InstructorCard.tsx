import { MessageSquare, Star } from 'lucide-react-native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles';

interface InstructorCardProps {
  course: any;
}

export const InstructorCard: React.FC<InstructorCardProps> = ({ course }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Instructor</Text>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.instructorContainer}>
          <Image
            source={{
              uri: course.creator.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg',
            }}
            style={styles.instructorAvatar}
          />
          <View style={styles.instructorInfo}>
            <Text style={styles.instructorName}>{course.creator.name}</Text>
            <Text style={styles.instructorRole}>Web Development Expert</Text>
            <View style={styles.instructorRating}>
              <Star size={12} color="#f59e0b" />
              <Text style={styles.instructorRatingText}>4.9 instructor rating</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.messageButton}>
          <MessageSquare size={16} color="#3b82f6" />
          <Text style={styles.messageButtonText}>Message Instructor</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
