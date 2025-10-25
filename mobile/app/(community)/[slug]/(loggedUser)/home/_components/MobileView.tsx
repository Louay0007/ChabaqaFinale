import React from 'react';
import { ScrollView, View } from 'react-native';
import ActiveMembers from '../../../../_components/ActiveMembers';
import BottomNavigation from '../../../../_components/BottomNavigation';
import Posts from '../../../../_components/Posts';
import { styles } from '../styles';
import CreatePostCard from './ComponentCard';

interface MobileViewProps {
  slug: string;
  newPost: string;
  setNewPost: (text: string) => void;
  onCreatePost: () => void;
  posts: any[];
  onLike: (postId: string) => void;
  onBookmark: (postId: string) => void;
}

export default function MobileView({
  slug,
  newPost,
  setNewPost,
  onCreatePost,
  posts,
  onLike,
  onBookmark,
}: MobileViewProps) {
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
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
