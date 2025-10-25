import { ThemedView } from '@/_components/ThemedView';
import {
    ChallengeTask,
    getChallengeById,
    getChallengeTasks
} from '@/lib/challenge-utils';
import {
    getCommunityBySlug
} from '@/lib/mock-data';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    Text
} from 'react-native';
import { styles } from '../styles';
import ChallengeHeader from './_components/ChallengeHeader';
import LeaderboardTab from './_components/LeaderboardTab';
import OverviewTab from './_components/OverviewTab';
import SubmissionsTab from './_components/SubmissionsTab';
import TabNavigation from './_components/TabNavigation';
import TimelineTab from './_components/TimelineTab';

export default function ChallengeDetailScreen() {
  const { slug, challengeId } = useLocalSearchParams<{ slug: string, challengeId: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedTaskDay, setSelectedTaskDay] = useState<number | null>(null);
  
  const community = getCommunityBySlug(slug as string);
  const challenge = getChallengeById(challengeId as string);
  const challengeTasks = challenge ? getChallengeTasks(challenge.id) : [];

  // Determine the current task based on selection or default to active/first
  const currentTask =
    selectedTaskDay !== null
      ? challengeTasks.find((t: ChallengeTask) => t.day === selectedTaskDay)
      : challengeTasks.find((t: ChallengeTask) => t.isActive) || challengeTasks[0];

  const completedTasks = challengeTasks.filter((t: ChallengeTask) => t.isCompleted).length;
  const totalPoints = challengeTasks.filter((t: ChallengeTask) => t.isCompleted).reduce((acc: number, task: ChallengeTask) => acc + task.points, 0);

  const leaderboard = [
    { rank: 1, name: "Alex Thompson", avatar: "https://via.placeholder.com/32", points: 2850, streak: 19 },
    { rank: 2, name: "Sarah Kim", avatar: "https://via.placeholder.com/32", points: 2720, streak: 18 },
    { rank: 3, name: "David Chen", avatar: "https://via.placeholder.com/32", points: 2680, streak: 19 },
    {
      rank: 47,
      name: "Mike Chen",
      avatar: "https://via.placeholder.com/32",
      points: 1850,
      streak: 18,
      isCurrentUser: true,
    },
  ];

  if (!community || !challenge) {
    return (
      <ThemedView style={styles.container}>
        <Text>Challenge not found</Text>
      </ThemedView>
    );
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Challenge Header */}
        <ChallengeHeader
          challenge={challenge}
          completedTasks={completedTasks}
          totalTasks={challengeTasks.length}
          totalPoints={totalPoints}
          formatDate={formatDate}
        />

        {/* Tab Navigation */}
        <TabNavigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <OverviewTab
            currentTask={currentTask}
            challenge={challenge}
            completedTasks={completedTasks}
            challengeTasks={challengeTasks}
            formatDate={formatDate}
          />
        )}

        {activeTab === 'timeline' && (
          <TimelineTab
            challengeTasks={challengeTasks}
            completedTasks={completedTasks}
            formatDate={formatDate}
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardTab
            leaderboard={leaderboard}
            currentUserRank={47}
          />
        )}

        {activeTab === 'submissions' && (
          <SubmissionsTab
            submissions={challengeTasks
              .filter((task: ChallengeTask) => task.isCompleted)
              .map((task: ChallengeTask) => ({
                id: task.id,
                taskDay: task.day,
                taskTitle: task.title,
                submittedAt: new Date(),
                status: 'approved' as const,
                feedback: 'Great work! Your solution was innovative and well-executed.'
              }))}
          />
        )}
      </ScrollView>
    </ThemedView>
  );
}
