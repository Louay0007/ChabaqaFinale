import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Linking,
  ScrollView,
  Text,
  View,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getCourseById, getUserEnrolledCourses } from '@/lib/course-api';
import { styles } from '../styles';

// Import des composants refactorisés
import { ChaptersCard } from './_components/CourseCard';
import { ContentTab } from './_components/ContentTab';
import { CourseHeader } from './_components/CourseHeader';
import { DiscussionTab } from './_components/DiscussionTab';
import { InstructorCard } from './_components/InstructorCard';
import { NotesTab } from './_components/NotesTab';
import { ProgressCard } from './_components/ProgressCard';
import { ResourcesTab } from './_components/ResourcesTab';
import { TabsNavigation, TabType } from './_components/TabsNavigation';
import { VideoPlayer } from './_components/VideoPlayer';

const { width } = Dimensions.get('window');

export default function CourseDetailsScreen() {
  const router = useRouter();
  const { slug, courseId } = useLocalSearchParams<{ slug: string; courseId: string }>();
  const [activeTab, setActiveTab] = useState<TabType>('content');
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);

  // State for real data
  const [course, setCourse] = useState<any>(null);
  const [enrollment, setEnrollment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourseDetails();
  }, [courseId]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📚 Fetching course details:', courseId);

      if (!courseId) throw new Error('Course ID is missing');

      // Fetch course and enrollments in parallel
      const [courseData, enrolledCourses] = await Promise.all([
        getCourseById(courseId),
        getUserEnrolledCourses().catch(err => {
          console.warn('Failed to fetch enrollments:', err);
          return [];
        })
      ]);

      // Transform course data (map chapitres to chapters)
      const transformedCourse = {
        ...courseData,
        sections: (courseData.sections || []).map((section: any) => ({
          ...section,
          chapters: section.chapters || section.chapitres || []
        }))
      };

      setCourse(transformedCourse);

      // Find enrollment for this course
      const userEnrollment = enrolledCourses.find((e: any) =>
        (e.courseId === courseId) || (e.course?._id === courseId)
      );

      if (userEnrollment) {
        // Transform enrollment data if needed
        setEnrollment({
          ...userEnrollment,
          progress: userEnrollment.progress || userEnrollment.progression || [],
          isCompleted: userEnrollment.isCompleted || userEnrollment.estTermine || false
        });
      }

    } catch (err: any) {
      console.error('❌ Error fetching course details:', err);

      // Fallback to mock data
      console.log('⚠️ Falling back to mock course data for ID:', courseId);

      // Dynamic import to avoid conflicts or use require
      const { getCourseById: getMockCourseById } = require('@/lib/course-utils');
      const mockCourse = getMockCourseById(courseId);

      if (mockCourse) {
        console.log('✅ Found mock course:', mockCourse.title);
        setCourse(mockCourse);
        // Reset error since we found a fallback
        setError(null);

        // Try to find mock enrollment
        // Assuming current user is "2" for mock data consistency with course-utils
        const { getUserEnrollments: getMockEnrollments } = require('@/lib/course-utils');
        const mockUserEnrollments = getMockEnrollments("2");
        const mockEnrollment = mockUserEnrollments.find((e: any) => e.courseId === courseId);

        if (mockEnrollment) {
          console.log('✅ Found mock enrollment');
          setEnrollment(mockEnrollment);
        }
      } else {
        setError(err.message || 'Failed to load course details');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#8e78fb" />
        <Text style={{ marginTop: 16, opacity: 0.7 }}>Loading course...</Text>
      </View>
    );
  }

  if (error || !course) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error || 'Course not found'}</Text>
      </View>
    );
  }

  const allChapters = (course.sections || []).flatMap((s: any) => s.chapters || []);
  const currentChapter = selectedChapter
    ? allChapters.find((c: any) => c.id === selectedChapter)
    : allChapters.length > 0
      ? allChapters[0]
      : null;

  const currentChapterIndex = currentChapter ? allChapters.findIndex((c: any) => c.id === currentChapter.id) : -1;

  // Calculate progress
  const totalChapters = allChapters.length;
  const completedChapters = enrollment?.progress?.filter((p: any) => p.isCompleted)?.length || 0;
  const progress = totalChapters > 0 ? (completedChapters / totalChapters) * 100 : 0;

  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes || 0);
    return `${mins} min`;
  };

  const isChapterAccessible = (chapterId: string): boolean => {
    const chapter = allChapters.find((c: any) => c.id === chapterId);
    if (!chapter) return false;
    return !!(enrollment || chapter.isPreview || !course.isPaid);
  };

  const openVideoUrl = (url?: string) => {
    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['right', 'bottom', 'left']}>
      <ScrollView>
        {/* Header with Progress Bar */}
        <CourseHeader
          course={course}
          progress={progress}
          allChapters={allChapters}
          slug={slug || ''}
          router={router}
        />

        <View style={styles.contentContainer}>
          {/* Video Player */}
          <VideoPlayer
            currentChapter={currentChapter}
            course={course}
            enrollment={enrollment}
            isChapterAccessible={isChapterAccessible}
            openVideoUrl={openVideoUrl}
          />

          {/* Tabs Navigation */}
          <TabsNavigation
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Tab Content */}
          {activeTab === 'content' && (
            <ContentTab
              currentChapter={currentChapter}
              currentChapterIndex={currentChapterIndex}
              allChapters={allChapters}
            />
          )}

          {activeTab === 'notes' && <NotesTab />}

          {activeTab === 'resources' && <ResourcesTab />}

          {activeTab === 'discussion' && <DiscussionTab />}

          {/* Sidebar Cards */}
          <View style={styles.sidebarCards}>
            <ProgressCard
              progress={progress}
              enrollment={enrollment}
              allChapters={allChapters}
            />

            <ChaptersCard
              course={course}
              selectedChapter={selectedChapter}
              setSelectedChapter={setSelectedChapter}
              enrollment={enrollment}
              isChapterAccessible={isChapterAccessible}
              formatTime={formatTime}
            />

            <InstructorCard course={course} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
