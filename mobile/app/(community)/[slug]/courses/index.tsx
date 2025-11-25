import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Course, Enrollment, Progress, Section, getCoursesByCommunity as getMockCourses, getUserEnrollments as getMockEnrollments } from '../../../../lib/course-utils';
import { getCoursesByCommunitySlug, getUserEnrolledCourses } from '../../../../lib/course-api';
import { getCommunityBySlug } from '../../../../lib/communities-api';
import { ThemedText } from '../../../../_components/ThemedText';
import BottomNavigation from '../../_components/BottomNavigation';
import { CoursesHeader } from './_components/CoursesHeader';
import { CoursesList } from './_components/CoursesList';
import { CoursesTabs } from './_components/CoursesTabs';
import { SearchBar } from './_components/SearchBar';
import { styles } from './styles';

export default function CoursesScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  // Real data state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [community, setCommunity] = useState<any>(null);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [userEnrollments, setUserEnrollments] = useState<any[]>([]);

  // Fetch data on component mount
  useEffect(() => {
    fetchCoursesData();
  }, [slug]);

  const fetchCoursesData = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📚 Fetching courses for community:', slug);

      // Fetch community data first
      const communityResponse = await getCommunityBySlug(slug || '');
      if (!communityResponse.success || !communityResponse.data) {
        throw new Error('Community not found');
      }

      const communityData = {
        id: communityResponse.data._id || communityResponse.data.id,
        name: communityResponse.data.name,
        slug: communityResponse.data.slug,
      };
      setCommunity(communityData);

      // Fetch courses for this community
      const coursesResponse = await getCoursesByCommunitySlug(slug as string, {
        page: 1,
        limit: 50,
        published: true
      });

      // Transform backend courses to match frontend interface
      const transformedCourses = (coursesResponse.courses || []).map((course: any) => {
        return {
          id: course._id || course.id,
          title: course.titre,
          description: course.description,
          shortDescription: course.description,
          thumbnail: course.thumbnail || course.thumbnailUrl || 'https://via.placeholder.com/400x300',
          communityId: communityData.id,
          creatorId: course.creatorId?._id || course.creatorId,
          creator: course.creator || (typeof course.creatorId === 'object' ? course.creatorId : null),
          price: course.prix || 0,
          currency: course.devise || 'TND',
          isPaid: course.isPaid || course.prix > 0,
          isPublished: course.isPublished,
          category: course.category,
          level: course.niveau,
          duration: course.duree,
          enrollmentCount: course.enrollmentCount || 0,
          rating: course.averageRating || 0,
          sections: (course.sections || []).map((section: any) => ({
            ...section,
            chapters: section.chapters || section.chapitres || []
          })),
          learningObjectives: course.learningObjectives || [],
          prerequisites: course.prerequisites || [],
          tags: course.tags || [],
          createdAt: new Date(course.createdAt),
          updatedAt: new Date(course.updatedAt),
        };
      });

      setAllCourses(transformedCourses);

      // Fetch user's enrolled courses
      try {
        const enrolledCourses = await getUserEnrolledCourses();
        const transformedEnrollments = enrolledCourses.map((enrollment: any) => ({
          id: enrollment.enrollment?._id || enrollment._id,
          courseId: enrollment.cours?._id || enrollment.course?._id,
          userId: enrollment.enrollment?.user || enrollment.user,
          enrolledAt: new Date(enrollment.enrollment?.inscritLe || enrollment.enrolledAt),
          progress: enrollment.progress || [],
          completionPercentage: enrollment.enrollment?.progressionPourcentage || 0,
          isCompleted: enrollment.enrollment?.estTermine || false,
          lastAccessedAt: enrollment.enrollment?.dernierAcces ? new Date(enrollment.enrollment.dernierAcces) : null,
        }));
        setUserEnrollments(transformedEnrollments);
      } catch (enrollmentError) {
        console.warn('⚠️ Could not fetch user enrollments:', enrollmentError);
        setUserEnrollments([]);
      }

      console.log('✅ Courses loaded:', transformedCourses.length);
    } catch (err: any) {
      console.error('❌ Error fetching courses:', err);
      setError(err.message || 'Failed to load courses');

      // Fallback to mock data
      console.log('⚠️ Falling back to mock data');
      const mockCourses = getMockCourses('1');
      const mockEnrollments = getMockEnrollments('2');

      setAllCourses(mockCourses);
      setUserEnrollments(mockEnrollments);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer les cours en fonction de l'onglet actif et de la recherche
  const filteredCourses = allCourses.filter((course: any) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    const isEnrolled = userEnrollments.some((e: any) => e.courseId === course.id);

    if (activeTab === 'enrolled') {
      return matchesSearch && isEnrolled;
    }
    if (activeTab === 'free') {
      return matchesSearch && course.price === 0;
    }
    if (activeTab === 'paid') {
      return matchesSearch && course.price > 0;
    }
    return matchesSearch;
  });

  // Calculer le progrès pour un cours
  const getEnrollmentProgress = (courseId: string) => {
    const enrollment = userEnrollments.find((e: any) => e.courseId === courseId);
    if (!enrollment) return null;

    const course = allCourses.find((c: any) => c.id === courseId);
    if (!course) return null;

    const totalChapters = course.sections.reduce((acc: number, s: any) => acc + (s.chapters?.length || 0), 0);
    const completed = enrollment.progress.filter((p: any) => p.isCompleted).length;
    return {
      completed,
      total: totalChapters,
      percentage: totalChapters > 0 ? (completed / totalChapters) * 100 : 0
    };
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#8e78fb" />
        <ThemedText style={{ marginTop: 16, opacity: 0.7 }}>Loading courses...</ThemedText>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <ThemedText style={{ color: '#ef4444', textAlign: 'center', margin: 20 }}>
          {error}
        </ThemedText>
        <ThemedText style={{ textAlign: 'center', opacity: 0.7 }}>
          Community: {slug}
        </ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CoursesHeader
        allCourses={allCourses}
        userEnrollments={userEnrollments}
      />

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <CoursesTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        allCourses={allCourses}
        userEnrollments={userEnrollments}
      />

      <CoursesList
        filteredCourses={filteredCourses}
        userEnrollments={userEnrollments}
        searchQuery={searchQuery}
        activeTab={activeTab}
        slug={slug as string}
        getEnrollmentProgress={getEnrollmentProgress}
      />

      {/* Bottom Navigation */}
      <BottomNavigation slug={slug as string} currentTab="courses" />
    </View>
  );
}
