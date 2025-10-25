import { useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect, useCallback } from 'react';
import { View, ActivityIndicator, Text, RefreshControl, ScrollView, TouchableOpacity } from 'react-native';
import { 
  Course, 
  getCoursesByCommunity, 
  getMyEnrolledCourses,
  CourseProgress,
  getCourseProgress,
  calculateProgressPercentage
} from '../../../../lib/course-api';
import { useAuth } from '../../../../hooks/use-auth';
import BottomNavigation from '../../_components/BottomNavigation';
import { CoursesHeader } from './_components/CoursesHeader';
import { CoursesList } from './_components/CoursesList';
import { CoursesTabs } from './_components/CoursesTabs';
import { SearchBar } from './_components/SearchBar';
import { styles } from './styles';

export default function CoursesScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { isAuthenticated, user } = useAuth();
  
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [communityId, setCommunityId] = useState<string>('');

  // Fetch community ID from slug
  // TODO: Implement getCommunityBySlug API call to get community ID
  // For now, using slug as placeholder
  useEffect(() => {
    // In future: fetch community details by slug to get ID
    // const fetchCommunity = async () => {
    //   const community = await getCommunityBySlug(slug as string);
    //   setCommunityId(community._id);
    // };
    // fetchCommunity();
    
    // Temporary: use slug as ID (will be replaced with real API call)
    setCommunityId(slug as string);
  }, [slug]);

  // Load courses from API
  const loadCourses = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');

      console.log('📚 [COURSES] Loading courses for community:', slug);

      // Fetch all courses for this community
      const response = await getCoursesByCommunity(communityId || '', {
        page: 1,
        limit: 50,
        sort_by: 'popular',
      });

      setAllCourses(response.courses);

      // Fetch enrolled courses if authenticated
      if (isAuthenticated) {
        const enrolled = await getMyEnrolledCourses();
        setEnrolledCourses(enrolled);
        console.log('✅ [COURSES] Enrolled courses loaded:', enrolled.length);
      }

      console.log('✅ [COURSES] Courses loaded successfully:', response.courses.length);
    } catch (err: any) {
      console.error('💥 [COURSES] Error loading courses:', err);
      setError(err.message || 'Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [communityId, isAuthenticated]);

  // Load courses on mount and when dependencies change
  useEffect(() => {
    if (communityId) {
      loadCourses();
    }
  }, [communityId, loadCourses]);

  // Handle refresh
  const handleRefresh = () => {
    loadCourses(true);
  };

  // Filter courses based on active tab and search
  const filteredCourses = allCourses.filter((course: Course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    const isEnrolled = enrolledCourses.some((e) => e._id === course._id);

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

  // Calculate enrollment progress for a course
  const getEnrollmentProgress = (courseId: string) => {
    const isEnrolled = enrolledCourses.some((c) => c._id === courseId);
    if (!isEnrolled) return null;

    // In real implementation, this would fetch from API
    // For now, return basic structure
    const course = allCourses.find((c) => c._id === courseId);
    if (!course) return null;

    const totalChapters = course.sections.reduce((acc, s) => acc + s.chapters.length, 0);
    
    // TODO: Fetch actual progress from API
    return { 
      completed: 0, 
      total: totalChapters, 
      percentage: 0
    };
  };

  // Render loading state
  if (loading && !refreshing) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#8e78fb" />
        <Text style={{ marginTop: 16, color: '#666', fontSize: 16 }}>Loading courses...</Text>
        <BottomNavigation slug={slug as string} currentTab="courses" />
      </View>
    );
  }

  // Render error state
  if (error && !refreshing) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Text style={{ fontSize: 48, marginBottom: 16 }}>⚠️</Text>
        <Text style={{ fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 8 }}>Oops!</Text>
        <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 }}>
          {error}
        </Text>
        <TouchableOpacity
          onPress={() => loadCourses()}
          style={{
            backgroundColor: '#8e78fb',
            paddingHorizontal: 24,
            paddingVertical: 12,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Try Again</Text>
        </TouchableOpacity>
        <BottomNavigation slug={slug as string} currentTab="courses" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CoursesHeader 
        allCourses={allCourses} 
        userEnrollments={enrolledCourses} 
      />
      
      <SearchBar 
        searchQuery={searchQuery} 
        onSearchChange={setSearchQuery} 
      />
      
      <CoursesTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        allCourses={allCourses}
        userEnrollments={enrolledCourses}
      />
      
      <CoursesList
        filteredCourses={filteredCourses}
        userEnrollments={enrolledCourses}
        searchQuery={searchQuery}
        activeTab={activeTab}
        slug={slug as string}
        getEnrollmentProgress={getEnrollmentProgress}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#8e78fb"
            colors={['#8e78fb']}
          />
        }
      />
      
      {/* Bottom Navigation */}
      <BottomNavigation slug={slug as string} currentTab="courses" />
    </View>
  );
}
