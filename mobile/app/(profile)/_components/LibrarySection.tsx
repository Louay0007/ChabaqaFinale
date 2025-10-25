import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';

import { useAdaptiveColors } from '@/hooks/useAdaptiveColors';
import { getMyJoinedCommunities } from '@/lib/communities-api';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '@/lib/design-tokens';

export default function LibrarySection() {
  const adaptiveColors = useAdaptiveColors();
  const [loading, setLoading] = useState(true);
  const [communities, setCommunities] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [challenges, setChallenges] = useState<any[]>([]);

  useEffect(() => {
    loadLibraryData();
  }, []);

  const loadLibraryData = async () => {
    try {
      setLoading(true);
      
      // Fetch joined communities
      const communitiesResult = await getMyJoinedCommunities();
      setCommunities(communitiesResult.data || []);

      // TODO: Fetch other data
      // const coursesResult = await getMyEnrolledCourses();
      // const challengesResult = await getMyActiveChallenges();
      
    } catch (error) {
      console.error('Error loading library:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: adaptiveColors.secondaryText }]}>
          Loading your library...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Communities Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="people" size={24} color={colors.primary} />
            <Text style={[styles.sectionTitle, { color: adaptiveColors.primaryText }]}>
              Joined Communities
            </Text>
          </View>
          <Text style={[styles.sectionCount, { color: adaptiveColors.secondaryText }]}>
            {communities.length}
          </Text>
        </View>

        {communities.length === 0 ? (
          <View style={[styles.emptyCard, { backgroundColor: adaptiveColors.cardBackground }]}>
            <Ionicons name="people-outline" size={48} color={adaptiveColors.secondaryText} />
            <Text style={[styles.emptyText, { color: adaptiveColors.secondaryText }]}>
              No communities joined yet
            </Text>
            <TouchableOpacity
              style={[styles.exploreButton, { backgroundColor: colors.primary }]}
              onPress={() => router.push('/(communities)')}
            >
              <Text style={styles.exploreButtonText}>Explore Communities</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.grid}>
            {communities.map((community, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.communityCard, { backgroundColor: adaptiveColors.cardBackground }]}
                onPress={() => router.push(`/(communities)/${community.slug || community._id}`)}
              >
                {community.coverImage || community.logo ? (
                  <Image
                    source={{ uri: community.coverImage || community.logo }}
                    style={styles.communityImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={[styles.communityImage, styles.communityImagePlaceholder]}>
                    <Ionicons name="people" size={32} color={colors.gray400} />
                  </View>
                )}
                <View style={styles.communityContent}>
                  <Text style={[styles.communityName, { color: adaptiveColors.primaryText }]} numberOfLines={1}>
                    {community.name}
                  </Text>
                  <Text style={[styles.communityMeta, { color: adaptiveColors.secondaryText }]}>
                    {community.membersCount || 0} members
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Courses Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="school" size={24} color={colors.coursesPrimary} />
            <Text style={[styles.sectionTitle, { color: adaptiveColors.primaryText }]}>
              Enrolled Courses
            </Text>
          </View>
          <Text style={[styles.sectionCount, { color: adaptiveColors.secondaryText }]}>
            {courses.length}
          </Text>
        </View>

        <View style={[styles.emptyCard, { backgroundColor: adaptiveColors.cardBackground }]}>
          <Ionicons name="school-outline" size={48} color={adaptiveColors.secondaryText} />
          <Text style={[styles.emptyText, { color: adaptiveColors.secondaryText }]}>
            No courses enrolled yet
          </Text>
          <Text style={[styles.emptySubtext, { color: adaptiveColors.secondaryText }]}>
            Join a community to access courses
          </Text>
        </View>
      </View>

      {/* Challenges Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="trophy" size={24} color={colors.challengesPrimary} />
            <Text style={[styles.sectionTitle, { color: adaptiveColors.primaryText }]}>
              Active Challenges
            </Text>
          </View>
          <Text style={[styles.sectionCount, { color: adaptiveColors.secondaryText }]}>
            {challenges.length}
          </Text>
        </View>

        <View style={[styles.emptyCard, { backgroundColor: adaptiveColors.cardBackground }]}>
          <Ionicons name="trophy-outline" size={48} color={adaptiveColors.secondaryText} />
          <Text style={[styles.emptyText, { color: adaptiveColors.secondaryText }]}>
            No active challenges
          </Text>
          <Text style={[styles.emptySubtext, { color: adaptiveColors.secondaryText }]}>
            Participate in challenges to test your skills
          </Text>
        </View>
      </View>

      {/* Sessions Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="videocam" size={24} color={colors.sessionsPrimary} />
            <Text style={[styles.sectionTitle, { color: adaptiveColors.primaryText }]}>
              Booked Sessions
            </Text>
          </View>
          <Text style={[styles.sectionCount, { color: adaptiveColors.secondaryText }]}>
            0
          </Text>
        </View>

        <View style={[styles.emptyCard, { backgroundColor: adaptiveColors.cardBackground }]}>
          <Ionicons name="videocam-outline" size={48} color={adaptiveColors.secondaryText} />
          <Text style={[styles.emptyText, { color: adaptiveColors.secondaryText }]}>
            No sessions booked
          </Text>
        </View>
      </View>

      {/* Products Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="bag" size={24} color={colors.productsPrimary} />
            <Text style={[styles.sectionTitle, { color: adaptiveColors.primaryText }]}>
              Purchased Products
            </Text>
          </View>
          <Text style={[styles.sectionCount, { color: adaptiveColors.secondaryText }]}>
            0
          </Text>
        </View>

        <View style={[styles.emptyCard, { backgroundColor: adaptiveColors.cardBackground }]}>
          <Ionicons name="bag-outline" size={48} color={adaptiveColors.secondaryText} />
          <Text style={[styles.emptyText, { color: adaptiveColors.secondaryText }]}>
            No products purchased
          </Text>
        </View>
      </View>

      {/* Events Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="calendar" size={24} color={colors.eventsPrimary} />
            <Text style={[styles.sectionTitle, { color: adaptiveColors.primaryText }]}>
              Events Attending
            </Text>
          </View>
          <Text style={[styles.sectionCount, { color: adaptiveColors.secondaryText }]}>
            0
          </Text>
        </View>

        <View style={[styles.emptyCard, { backgroundColor: adaptiveColors.cardBackground }]}>
          <Ionicons name="calendar-outline" size={48} color={adaptiveColors.secondaryText} />
          <Text style={[styles.emptyText, { color: adaptiveColors.secondaryText }]}>
            No events registered
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xxl,
  },

  loadingText: {
    fontSize: fontSize.base,
    marginTop: spacing.lg,
  },

  section: {
    padding: spacing.xl,
    paddingBottom: 0,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },

  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },

  sectionCount: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },

  // Grid for communities
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },

  communityCard: {
    width: '47%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },

  communityImage: {
    width: '100%',
    height: 100,
    backgroundColor: colors.gray100,
  },

  communityImagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  communityContent: {
    padding: spacing.md,
  },

  communityName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    marginBottom: spacing.xs,
  },

  communityMeta: {
    fontSize: fontSize.xs,
  },

  // Empty State
  emptyCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.xxl,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  emptyText: {
    fontSize: fontSize.base,
    marginTop: spacing.lg,
    textAlign: 'center',
  },

  emptySubtext: {
    fontSize: fontSize.sm,
    marginTop: spacing.sm,
    textAlign: 'center',
  },

  exploreButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    marginTop: spacing.lg,
  },

  exploreButtonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.white,
  },
});
