import { Trophy, Zap } from 'lucide-react-native';
import React from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { styles } from '../../styles';


interface LeaderboardEntry {
  id?: string;
  rank: number;
  username?: string;
  name?: string;
  avatar: string;
  points: number;
  streak?: number;
  completedTasks?: number;
  isCurrentUser?: boolean;
}

interface LeaderboardTabProps {
  leaderboard: LeaderboardEntry[];
  currentUserRank?: number;
}

function LeaderboardItem({ item }: { item: LeaderboardEntry }) {
  const displayName = item.username || item.name || 'Unknown User';
  const streakValue = item.streak || item.completedTasks || 0;

  return (
    <View style={[styles.leaderboardItem, item.isCurrentUser && styles.currentUserLeaderboardItem]}>
      <View style={styles.leaderboardRank}>
        <Text style={styles.rankText}>#{item.rank}</Text>
      </View>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.leaderboardUserInfo}>
        <Text style={styles.userName}>{displayName}</Text>
        <View style={styles.userStats}>
          <View style={styles.statBadge}>
            <Trophy size={12} color="#f59e0b" />
            <Text style={styles.statBadgeText}>{item.points} pts</Text>
          </View>
          <View style={styles.statBadge}>
            <Zap size={12} color="#f97316" />
            <Text style={styles.statBadgeText}>{streakValue} day streak</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function LeaderboardTab({ leaderboard, currentUserRank }: LeaderboardTabProps) {
  const renderLeaderboardItem = ({ item }: { item: LeaderboardEntry }) => (
    <LeaderboardItem item={item} />
  );

  return (
    <View style={styles.tabContent}>
      <View style={styles.leaderboardCard}>
        <View style={styles.leaderboardHeader}>
          <Trophy size={18} color="#f59e0b" />
          <Text style={styles.cardTitle}>Challenge Leaderboard</Text>
        </View>
        <Text style={styles.cardSubtitle}>See how you rank against other participants</Text>
        
        <FlatList
          data={leaderboard}
          renderItem={renderLeaderboardItem}
          keyExtractor={(item, index) => item.id || item.rank.toString() || index.toString()}
          style={styles.leaderboardList}
          scrollEnabled={false}
        />
      </View>
    </View>
  );
}
