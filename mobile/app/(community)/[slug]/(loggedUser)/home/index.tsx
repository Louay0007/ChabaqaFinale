import {
  getCommunityBySlug,
  getCurrentUser,
  mockPosts
} from '@/lib/mock-data';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  View
} from 'react-native';
import MobileView from "./_components/MobileView";
import { styles } from './styles';

export default function CommunityDashboard() {
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState(mockPosts);
  const { slug } = useLocalSearchParams();
  const community = getCommunityBySlug(slug as string);
  const currentUser = getCurrentUser();

  if (!community) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Community not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleLike = (postId: string) => {
    setPosts(
      posts.map((post: any) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleBookmark = (postId: string) => {
    setPosts(
      posts.map((post: any) =>
        post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post
      )
    );
  };

  const handleCreatePost = () => {
    if (newPost.trim()) {
      const post = {
        id: Date.now().toString(),
        content: newPost,
        author: {
          id: currentUser?.id || "",
          name: currentUser?.name || "",
          avatar: currentUser?.avatar || "https://via.placeholder.com/40",
          role: currentUser?.role || "member",
        },
        createdAt: new Date(),
        likes: 0,
        comments: 0,
        shares: 0,
        images: [] as string[],
        tags: [] as string[],
        isLiked: false,
        isBookmarked: false,
      };
      setPosts([post, ...posts]);
      setNewPost("");
    }
  };

  // Application mobile uniquement
  return (
    <MobileView
      slug={slug as string}
      newPost={newPost}
      setNewPost={setNewPost}
      onCreatePost={handleCreatePost}
      posts={posts}
      onLike={handleLike}
      onBookmark={handleBookmark}
    />
  );
}