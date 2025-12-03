import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList } from 'react-native';
import { styles } from '../styles';
import { CourseCard } from './CourseCard';
import { EmptyState } from './EmptyState';

interface CoursesListProps {
  filteredCourses: any[];
  userEnrollments: any[];
  searchQuery: string;
  activeTab: string;
  slug: string;
  getEnrollmentProgress: (courseId: string) => any;
}

export const CoursesList: React.FC<CoursesListProps> = ({
  filteredCourses,
  userEnrollments,
  searchQuery,
  activeTab,
  slug,
  getEnrollmentProgress,
}) => {
  const router = useRouter();

  // Naviguer vers les détails du cours
  const navigateToCourseDetails = (courseId: string) => {
    router.push(`/(community)/${slug}/courses/${courseId}`);
  };

  // Rendu d'un cours dans la liste
  const renderCourseItem = ({ item }: { item: any }) => {
    const isEnrolled = userEnrollments.some((e: any) => e.courseId === item.id);
    const progress = getEnrollmentProgress(item.id);
    const totalChapters = (item.sections || []).reduce((acc: number, s: any) => acc + (s.chapters?.length || 0), 0);

    return (
      <CourseCard
        course={item}
        isEnrolled={isEnrolled}
        progress={progress}
        totalChapters={totalChapters}
        onPress={() => navigateToCourseDetails(item.id)}
      />
    );
  };

  if (filteredCourses.length === 0) {
    return <EmptyState searchQuery={searchQuery} activeTab={activeTab} />;
  }

  return (
    <FlatList
      data={filteredCourses}
      renderItem={renderCourseItem}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.courseList}
      showsVerticalScrollIndicator={false}
    />
  );
};
