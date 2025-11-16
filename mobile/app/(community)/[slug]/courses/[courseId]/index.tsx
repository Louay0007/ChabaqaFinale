import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Linking,
  ScrollView,
  Text,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Chapter, Enrollment, getCourseById, getUserEnrollments, Progress, Section } from '../../../../../lib/course-utils';
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

  // Mock data
  const course = getCourseById(courseId || '');
  const userEnrollments = getUserEnrollments('2'); // Mock user ID
  const enrollment = userEnrollments.find((e: Enrollment) => e.courseId === courseId);

  if (!course) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Course not found</Text>
      </View>
    );
  }

  const allChapters = course.sections.flatMap((s: Section) => s.chapters);
  const currentChapter = selectedChapter
    ? allChapters.find((c: Chapter) => c.id === selectedChapter)
    : allChapters.length > 0
    ? allChapters[0]
    : null;

  const currentChapterIndex = currentChapter ? allChapters.findIndex((c: Chapter) => c.id === currentChapter.id) : -1;
  const progress = enrollment
    ? (enrollment.progress.filter((p: Progress) => p.isCompleted).length / allChapters.length) * 100
    : 0;

  const formatTime = (minutes: number) => {
    const mins = Math.floor(minutes);
    return `${mins} min`;
  };

  const isChapterAccessible = (chapterId: string): boolean => {
    const chapter = allChapters.find((c: Chapter) => c.id === chapterId);
    if (!chapter) return false;
    return !!(enrollment || chapter.isPreview);
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
