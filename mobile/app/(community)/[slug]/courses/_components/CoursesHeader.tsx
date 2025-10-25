import { BookOpen } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../styles';

interface CoursesHeaderProps {
  allCourses: any[];
  userEnrollments: any[];
}

export const CoursesHeader: React.FC<CoursesHeaderProps> = ({ 
  allCourses, 
  userEnrollments 
}) => {
  return (
    <View style={styles.header}>
      {/* Background circles */}
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />
      
      <View style={styles.headerContent}>
        {/* Left side - Title and subtitle */}
        <View style={styles.titleSection}>
          <View style={styles.titleContainer}>
            <BookOpen size={20} color="#fff" />
            <Text style={styles.title} numberOfLines={1}>Learning Hub</Text>
          </View>
          <Text style={styles.subtitle}>
            Master new skills with our courses
          </Text>
        </View>
        
        {/* Right side - Stats horizontal */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{allCourses.length}</Text>
            <Text style={styles.statLabel}>Total Courses</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userEnrollments.length}</Text>
            <Text style={styles.statLabel}>Enrolled</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {userEnrollments.reduce(
                (acc: number, e: any) => acc + e.progress.filter((p: any) => p.isCompleted).length,
                0
              )}
            </Text>
            <Text style={styles.statLabel}>Completed Chapters</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>
              {userEnrollments.length > 0 
                ? Math.round(
                    userEnrollments.reduce((acc: number, e: any) => {
                      const course = allCourses.find((c: any) => c.id === e.courseId);
                      if (!course) return acc;
                      const totalChapters = course.sections.reduce((total: number, s: any) => total + s.chapters.length, 0);
                      const completedChapters = e.progress.filter((p: any) => p.isCompleted).length;
                      return acc + (totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0);
                    }, 0) / userEnrollments.length
                  ) 
                : 0}%
            </Text>
            <Text style={styles.statLabel}>Avg Progress</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
