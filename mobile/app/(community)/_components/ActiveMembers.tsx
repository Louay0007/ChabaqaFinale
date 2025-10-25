import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { communityStyles } from './community-styles';

interface ActiveMember {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
}

interface ActiveMembersProps {
  members?: ActiveMember[];
}

const defaultMembers: ActiveMember[] = [
  {
    id: "1",
    name: "Sarah",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b550?w=150&h=150&fit=crop&crop=face",
    isOnline: true
  },
  {
    id: "2", 
    name: "Mike",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    isOnline: true
  },
  {
    id: "3",
    name: "Emily", 
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    isOnline: false
  },
  {
    id: "4",
    name: "David",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face", 
    isOnline: true
  },
  {
    id: "5",
    name: "Alex",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    isOnline: false
  },
  {
    id: "6",
    name: "Jessica",
    avatar: "https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=150&h=150&fit=crop&crop=face",
    isOnline: true
  },
  {
    id: "7", 
    name: "James",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    isOnline: false
  },
  {
    id: "8",
    name: "Lisa",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
    isOnline: true
  }
];

export default function ActiveMembers({ members = defaultMembers }: ActiveMembersProps) {
  return (
    <View style={communityStyles.cardContainer}>
      <View style={communityStyles.sectionHeader}>
        <Text style={communityStyles.sectionTitle}>Active Members</Text>
        <Text style={communityStyles.sectionSubtitle}>See who's online now</Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={communityStyles.horizontalScroll}
      >
        {/* Members List */}
        {members.map((member) => (
          <TouchableOpacity key={member.id} style={communityStyles.memberItem}>
            <View style={communityStyles.avatarContainer}>
              <Image source={{ uri: member.avatar }} style={communityStyles.avatar} />
              {member.isOnline && <View style={communityStyles.onlineIndicator} />}
            </View>
            <Text style={communityStyles.memberName} numberOfLines={1}>
              {member.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

