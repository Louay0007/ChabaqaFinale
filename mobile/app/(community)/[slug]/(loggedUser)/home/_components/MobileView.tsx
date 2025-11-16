import React from 'react';
import { ScrollView, View, RefreshControl } from 'react-native';
import ActiveMembers from '../../../../_components/ActiveMembers';
import BottomNavigation from '../../../../_components/BottomNavigation';
import Posts from '../../../../_components/Posts';
import { styles } from '../styles';
import CreatePostCard from './ComponentCard';

interface MobileViewProps {
  slug: string;
  community: any;
  newPost: string;
  setNewPost: (text: string) => void;
  onCreatePost: () => Promise<void>;
  posts: any[];
  onLike: (postId: string) => Promise<void>;
  onBookmark: (postId: string) => Promise<void>;
  refreshing?: boolean;
  onRefresh?: () => Promise<void>;
  creatingPost?: boolean;
}

export default function MobileView({
  slug,
  community,
  newPost,
  setNewPost,
  onCreatePost,
  posts,
  onLike,
  onBookmark,
  refreshing,
  onRefresh,
  creatingPost,
}: MobileViewProps) {
  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollContainer}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing || false}
              onRefresh={onRefresh}
              colors={['#8e78fb']}
              tintColor="#8e78fb"
            />
          ) : undefined
        }
      >
        <View style={styles.mobileContent}>
          {/* Active Members */}
          <ActiveMembers />
          
          {/* Create Post */}
          <CreatePostCard
            newPost={newPost}
            setNewPost={setNewPost}
            onCreatePost={onCreatePost}
          />

          {/* Posts Feed */}
          <Posts 
            posts={posts}
            onLike={onLike}
            onBookmark={onBookmark}
          />
        </View>
      </ScrollView>
      
      {/* Bottom Navigation */}
      <BottomNavigation slug={slug} currentTab="home" />
    </View>
  );
}
