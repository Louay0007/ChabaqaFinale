import { Router } from 'expo-router';
import { ChevronLeft, Star } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles';

interface CourseHeaderProps {
  course: {
    title: string;
  };
  progress: number;
  allChapters: any[];
  slug: string;
  router: Router;
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({ course, progress, allChapters, slug, router }) => {
  return (
    <>
      <View style={styles.detailHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.push(`/(community)/${slug}/courses`)}
        >
          <ChevronLeft size={20} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.detailCourseTitle}>{course.title}</Text>
          <View style={styles.courseInfo}>
            <Text style={styles.infoText}>Progress: {Math.round(progress)}%</Text>
            <Text style={styles.infoSeparator}>•</Text>
            <Text style={styles.infoText}>{allChapters.length} chapters</Text>
            <Text style={styles.infoSeparator}>•</Text>
            <View style={styles.ratingContainer}>
              <Star size={14} color="#f59e0b" />
              <Text style={styles.infoText}>4.8</Text>
            </View>
          </View>
        </View>
      </View>
      
      <View style={styles.detailProgressBarContainer}>
        <View style={styles.detailProgressBar}>
          <View
            style={[
              styles.detailProgressFill,
              { width: `${progress}%` }
            ]}
          />
        </View>
      </View>
    </>
  );
};
