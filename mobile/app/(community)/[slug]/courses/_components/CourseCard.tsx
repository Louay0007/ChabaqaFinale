import { BookOpen, CheckCircle, Clock, Star, Users } from 'lucide-react-native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';

interface CourseCardProps {
  course: any;
  isEnrolled: boolean;
  progress: {
    completed: number;
    total: number;
    percentage: number;
  } | null;
  totalChapters: number;
  onPress: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  isEnrolled,
  progress,
  totalChapters,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View>
        <Image
          source={{ uri: course.thumbnail || 'https://picsum.photos/800/600' }}
          style={styles.courseImage}
        />
        <View style={styles.courseBadge}>
          {isEnrolled ? (
            <View style={[styles.badge, styles.enrolledBadge]}>
              <CheckCircle size={12} color="#fff" />
              <Text style={styles.badgeText}>Enrolled</Text>
            </View>
          ) : course.price === 0 ? (
            <View style={[styles.badge, styles.freeBadge]}>
              <Text style={styles.badgeText}>Free</Text>
            </View>
          ) : (
            <View style={[styles.badge, styles.priceBadge]}>
              <Text style={styles.badgeText}>${course.price}</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.courseContent}>
        <View style={styles.courseHeader}>
          <Text style={styles.courseTitle} numberOfLines={1}>
            {course.title}
          </Text>
          <View style={styles.ratingContainer}>
            <Star size={14} color="#f59e0b" />
            <Text style={styles.ratingText}>4.8</Text>
          </View>
        </View>

        <Text style={styles.courseDescription} numberOfLines={2}>
          {course.description}
        </Text>

        <View style={styles.courseStats}>
          <View style={styles.courseStatItem}>
            <BookOpen size={12} color="#6b7280" />
            <Text style={styles.statText}>{(course.sections || []).length} sections</Text>
          </View>
          <View style={styles.courseStatItem}>
            <Clock size={12} color="#6b7280" />
            <Text style={styles.statText}>{totalChapters} chapters</Text>
          </View>
          <View style={styles.courseStatItem}>
            <Users size={12} color="#6b7280" />
            <Text style={styles.statText}>{course.enrollmentCount || (course.enrollments || []).length} students</Text>
          </View>
          {course.level && (
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{course.level}</Text>
            </View>
          )}
        </View>

        {progress && (
          <View style={styles.progressContainer}>
            <View style={styles.progressTextContainer}>
              <Text style={styles.progressText}>Your Progress</Text>
              <Text style={styles.progressText}>
                {progress.completed}/{progress.total} chapters
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progress.percentage}%` },
                ]}
              />
            </View>
          </View>
        )}

        <View style={styles.courseFooter}>
          <View style={styles.creatorContainer}>
            <Image
              source={{
                uri: course.creator?.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg',
              }}
              style={styles.creatorAvatar}
            />
            <Text style={styles.creatorName}>{course.creator?.name || 'Unknown'}</Text>
          </View>

          <TouchableOpacity
            style={[
              styles.actionButton,
              isEnrolled ? styles.continueButton : styles.enrollButton,
            ]}
            onPress={onPress}
          >
            <Text
              style={[
                styles.actionButtonText,
                isEnrolled ? styles.continueButtonText : styles.enrollButtonText,
              ]}
            >
              {isEnrolled
                ? 'Continue'
                : course.price === 0
                  ? 'Enroll Free'
                  : `Enroll $${course.price}`}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};
