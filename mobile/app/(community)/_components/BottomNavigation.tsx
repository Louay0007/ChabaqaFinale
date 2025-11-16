import { colors } from '@/lib/design-tokens';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BookOpen, Calendar, Home, Package, Sparkles, Zap } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { communityStyles, sectionColors } from './community-styles';

interface BottomNavigationProps {
  slug?: string;
  currentTab?: string;
}

export default function BottomNavigation({ slug, currentTab = 'home' }: BottomNavigationProps) {
  const router = useRouter();
  const params = useLocalSearchParams<{ slug: string }>();
  const communitySlug = slug || params.slug;
  const insets = useSafeAreaInsets();
  
  const handleHome = () => {
    router.replace(`/(community)/${communitySlug}/(loggedUser)/home`);
  };
  
  const handleCourses = () => {
    router.replace(`/(community)/${communitySlug}/courses`);
  };
  
  const handleChallenge = () => {
    router.replace(`/(community)/${communitySlug}/challenges`);
  };
  
  const handleSessions = () => {
    router.replace(`/(community)/${communitySlug}/sessions`);
  };
  
  const handleProducts = () => {
    router.replace(`/(community)/${communitySlug}/products`);
  };

  const handleEvents = () => {
    router.replace(`/(community)/${communitySlug}/events`);
  };

  const isActive = (tab: string) => currentTab === tab;

  return (
    <View style={[communityStyles.bottomBarContainer, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      <View style={communityStyles.bottomBar}>
        {/* Home */}
        <TouchableOpacity
          style={communityStyles.tabButton}
          onPress={handleHome}
          activeOpacity={0.8}
        >
          <View style={[communityStyles.iconContainer, isActive('home') && styles.activeIconContainer]}>
            <Home 
              size={20} 
              color={isActive('home') ? colors.white : colors.gray500} 
            />
          </View>
          <Text style={[communityStyles.tabText, isActive('home') && styles.activeTabText]}>
            Home
          </Text>
        </TouchableOpacity>

        {/* Courses */}
        <TouchableOpacity
          style={communityStyles.tabButton}
          onPress={handleCourses}
          activeOpacity={0.8}
        >
          <View style={[communityStyles.iconContainer, isActive('courses') && styles.activeIconContainerCourses]}>
            <BookOpen 
              size={20} 
              color={isActive('courses') ? colors.white : sectionColors.courses.primary} 
            />
          </View>
          <Text style={[communityStyles.tabText, isActive('courses') && styles.activeTabTextCourses]}>
            Courses
          </Text>
        </TouchableOpacity>

        {/* Challenge */}
        <TouchableOpacity
          style={communityStyles.tabButton}
          onPress={handleChallenge}
          activeOpacity={0.8}
        >
          <View style={[communityStyles.iconContainer, isActive('challenges') && styles.activeIconContainerChallenge]}>
            <Zap 
              size={20} 
              color={isActive('challenges') ? colors.white : sectionColors.challenges.primary} 
            />
          </View>
          <Text style={[communityStyles.tabText, isActive('challenges') && styles.activeTabTextChallenge]}>
            Challenge
          </Text>
        </TouchableOpacity>

        {/* Sessions */}
        <TouchableOpacity
          style={communityStyles.tabButton}
          onPress={handleSessions}
          activeOpacity={0.8}
        >
          <View style={[communityStyles.iconContainer, isActive('sessions') && styles.activeIconContainerSessions]}>
            <Calendar 
              size={20} 
              color={isActive('sessions') ? colors.white : sectionColors.sessions.primary} 
            />
          </View>
          <Text style={[communityStyles.tabText, isActive('sessions') && styles.activeTabTextSessions]}>
            Sessions
          </Text>
        </TouchableOpacity>

        {/* Products */}
        <TouchableOpacity
          style={communityStyles.tabButton}
          onPress={handleProducts}
          activeOpacity={0.8}
        >
          <View style={[communityStyles.iconContainer, isActive('products') && styles.activeIconContainerProducts]}>
            <Package 
              size={20} 
              color={isActive('products') ? colors.white : sectionColors.products.primary} 
            />
          </View>
          <Text style={[communityStyles.tabText, isActive('products') && styles.activeTabTextProducts]}>
            Products
          </Text>
        </TouchableOpacity>

        {/* Events */}
        <TouchableOpacity
          style={communityStyles.tabButton}
          onPress={handleEvents}
          activeOpacity={0.8}
        >
          <View style={[communityStyles.iconContainer, isActive('events') && styles.activeIconContainerEvents]}>
            <Sparkles 
              size={20} 
              color={isActive('events') ? colors.white : sectionColors.events.primary} 
            />
          </View>
          <Text style={[communityStyles.tabText, isActive('events') && styles.activeTabTextEvents]}>
            Events
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Seuls les styles spécifiques qui ne sont pas dans communityStyles
  activeIconContainer: {
    backgroundColor: colors.coursesPrimary,
  },
  activeIconContainerCourses: {
    backgroundColor: sectionColors.courses.primary,
  },
  activeIconContainerChallenge: {
    backgroundColor: sectionColors.challenges.primary,
  },
  activeIconContainerEvents: {
    backgroundColor: sectionColors.events.primary,
  },
  activeIconContainerSessions: {
    backgroundColor: sectionColors.sessions.primary,
  },
  activeIconContainerProducts: {
    backgroundColor: sectionColors.products.primary,
  },
  activeTabText: {
    color: colors.coursesPrimary,
    fontWeight: '600',
  },
  activeTabTextCourses: {
    color: sectionColors.courses.primary,
    fontWeight: '600',
  },
  activeTabTextChallenge: {
    color: sectionColors.challenges.primary,
    fontWeight: '600',
  },
  activeTabTextEvents: {
    color: sectionColors.events.primary,
    fontWeight: '600',
  },
  activeTabTextSessions: {
    color: sectionColors.sessions.primary,
    fontWeight: '600',
  },
  activeTabTextProducts: {
    color: sectionColors.products.primary,
    fontWeight: '600',
  },
});
