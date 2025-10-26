import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  Linking,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Course,
  CourseChapter,
  CourseSection,
  CourseProgress,
  getCourseById, 
  getCourseProgress,
  enrollInCourse,
  isEnrolledInCourse
} from '../../../../../lib/course-api';
import { useAuth } from '../../../../../hooks/use-auth';
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
import { ReviewsTab } from './_components/ReviewsTab';
import { TabsNavigation, TabType } from './_components/TabsNavigation';
import { VideoPlayer } from './_components/VideoPlayer';

const { width } = Dimensions.get('window');

export default function CourseDetailsScreen() {
  const router = useRouter();
  const { slug, courseId } = useLocalSearchParams<{ slug: string; courseId: string }>();
  const { isAuthenticated } = useAuth();
  
  // State management
  const [activeTab, setActiveTab] = useState<TabType>('content');
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');

  // Load course data
  useEffect(() => {
    loadCourseData();
  }, [courseId, isAuthenticated]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('📚 [COURSE-DETAIL] Loading course:', courseId);

      // Fetch course details
      const courseData = await getCourseById(courseId || '');
      setCourse(courseData);

      // Check enrollment and fetch progress if authenticated
      if (isAuthenticated) {
        const enrolled = await isEnrolledInCourse(courseId || '');
        setIsEnrolled(enrolled);

        if (enrolled) {
          try {
            const progressData = await getCourseProgress(courseId || '');
            setProgress(progressData);
          } catch (err) {
            console.log('ℹ️ [COURSE-DETAIL] No progress data yet');
          }
        }
      }

      console.log('✅ [COURSE-DETAIL] Course loaded successfully');
    } catch (err: any) {
      console.error('💥 [COURSE-DETAIL] Error loading course:', err);
      setError(err.message || 'Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  // Handle enrollment
  const handleEnroll = async () => {
    if (!isAuthenticated) {
      Alert.alert(
        'Login Required',
        'Please login to enroll in this course',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Login', 
            onPress: () => router.push('/(auth)/signin')
          }
        ]
      );
      return;
    }

    try {
      setEnrolling(true);
      console.log('📝 [COURSE-DETAIL] Enrolling in course...');
      
      await enrollInCourse(courseId || '');
      
      Alert.alert(
        'Success!',
        'You have successfully enrolled in this course',
        [{ text: 'OK', onPress: () => loadCourseData() }]
      );
      
      console.log('✅ [COURSE-DETAIL] Enrollment successful');
    } catch (err: any) {
      console.error('💥 [COURSE-DETAIL] Enrollment error:', err);
      Alert.alert(
        'Enrollment Failed',
        err.message || 'Failed to enroll in course. Please try again.'
      );
    } finally {
      setEnrolling(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#8e78fb" />
        <Text style={{ marginTop: 16, color: '#666', fontSize: 16 }}>Loading course...</Text>
      </SafeAreaView>
    );
  }

  // Error state
  if (error || !course) {
    return (
      <SafeAreaView style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>⚠️</Text>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8 }}>Oops!</Text>
        <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 }}>
          {error || 'Course not found'}
        </Text>
        <TouchableOpacity
          onPress={loadCourseData}
          style={{
            backgroundColor: '#8e78fb',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            marginTop: 12,
            paddingHorizontal: 24,
            paddingVertical: 12,
          }}
        >
          <Text style={{ color: '#8e78fb', fontSize: 16, fontWeight: '600' }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const allChapters = course.sections.flatMap((s) => s.chapters);
  const currentChapter = selectedChapter
    ? allChapters.find((c) => c._id === selectedChapter)
    : allChapters.length > 0
    ? allChapters[0]
    : null;

  const currentChapterIndex = currentChapter ? allChapters.findIndex((c) => c._id === currentChapter._id) : -1;
  const completionPercentage = progress?.enrollment?.completion_percentage || 0;

  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    return `${mins} min`;
  };

  const isChapterAccessible = (chapterId: string): boolean => {
    const chapter = allChapters.find((c) => c._id === chapterId);
    if (!chapter) return false;
    return !!(isEnrolled || chapter.is_preview);
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
          progress={completionPercentage}
          allChapters={allChapters}
          slug={slug || ''}
          router={router}
          isEnrolled={isEnrolled}
          enrolling={enrolling}
          onEnroll={handleEnroll}
        />

        <View style={styles.contentContainer}>
          {/* Video Player */}
          <VideoPlayer
            currentChapter={currentChapter}
            course={course}
            enrollment={isEnrolled}
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

          {activeTab === 'reviews' && <ReviewsTab course={course} />}

          {/* Sidebar Cards */}
          <View style={styles.sidebarCards}>
            <ProgressCard 
              progress={completionPercentage}
              enrollment={isEnrolled}
              allChapters={allChapters}
              completedChapters={progress?.completed_chapters_count || 0}
            />

            <ChaptersCard
              course={course}
              selectedChapter={selectedChapter}
              setSelectedChapter={setSelectedChapter}
              enrollment={isEnrolled}
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
