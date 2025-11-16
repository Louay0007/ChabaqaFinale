import { colors } from '@/lib/design-tokens';
import {
  Bookmark,
  Heart,
  MessageSquare,
  MoreHorizontal,
  Share
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { communityStyles } from './community-styles';
import PostMenuOverlay from './modals/PostMenuOverlay';

// Import from mock-data
interface PostAuthor {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

interface Post {
  id: string;
  content: string;
  author: PostAuthor;
  createdAt: Date;
  likes: number;
  comments: number;
  shares: number;
  images: string[];
  tags: string[];
  isLiked: boolean;
  isBookmarked: boolean;
}

interface PostsProps {
  posts: Post[];
  onLike: (postId: string) => void;
  onBookmark: (postId: string) => void;
}

export default function Posts({ posts, onLike, onBookmark }: PostsProps) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [menuAnchorPostId, setMenuAnchorPostId] = useState<string | null>(null);
  const windowWidth = Dimensions.get('window').width;
  
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };
  
  const handleOpenMenu = (postId: string) => {
    // Store the post ID and show the menu
    setMenuAnchorPostId(postId);
    setSelectedPostId(postId);
    setMenuVisible(true);
  };
  
  const handleCloseMenu = () => {
    setMenuVisible(false);
    setSelectedPostId(null);
    setMenuAnchorPostId(null);
  };
  
  const handleSavePost = () => {
    // Implement save post functionality here
    console.log('Saving post:', selectedPostId);
    handleCloseMenu();
  };
  
  const handleHidePost = () => {
    // Implement hide post functionality here
    console.log('Hiding post:', selectedPostId);
    handleCloseMenu();
  };
  
  const handleReportPost = () => {
    // Implement report post functionality here
    console.log('Reporting post:', selectedPostId);
    handleCloseMenu();
  };

  const renderPostItem = ({ item }: { item: Post }) => (
    <View style={communityStyles.postCard}>
      <View style={communityStyles.postHeader}>
        <View style={communityStyles.authorContainer}>
          <Image
            source={{ uri: item.author.avatar }}
            style={communityStyles.avatarSmall}
          />
          <View>
            <Text style={communityStyles.authorName}>{item.author.name}</Text>
            <Text style={communityStyles.postMeta}>
              {formatTimeAgo(item.createdAt)} • {item.author.role}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          onPress={() => handleOpenMenu(item.id)}
          style={communityStyles.menuButton}
        >
          <MoreHorizontal size={20} color={colors.gray500} />
        </TouchableOpacity>
      </View>

      <Text style={communityStyles.postContent}>{item.content}</Text>

      {item.tags.length > 0 && (
        <View style={communityStyles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={communityStyles.tag}>
              <Text style={communityStyles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {item.images && item.images.length > 0 && (
        <Image
          source={{ uri: item.images[0] }}
          style={communityStyles.postImage}
          resizeMode="cover"
        />
      )}

      <View style={communityStyles.postActions}>
        <View style={communityStyles.leftActions}>
          <TouchableOpacity
            style={communityStyles.actionButton}
            onPress={() => onLike(item.id)}
          >
            <Heart
              size={18}
              color={item.isLiked ? colors.error : colors.gray500}
              fill={item.isLiked ? colors.error : "transparent"}
            />
            <Text style={communityStyles.actionText}>{item.likes}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={communityStyles.actionButton}>
            <MessageSquare size={18} color={colors.gray500} />
            <Text style={communityStyles.actionText}>{item.comments}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={communityStyles.actionButton}>
            <Share size={18} color={colors.gray500} />
            <Text style={communityStyles.actionText}>{item.shares}</Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={styles.bookmarkButton}
          onPress={() => onBookmark(item.id)}
        >
          <Bookmark
            size={20}
            color={item.isBookmarked ? colors.warning : colors.gray500}
            fill={item.isBookmarked ? colors.warning : "transparent"}
          />
        </TouchableOpacity>
      </View>
      
      {/* Overlay menu for this specific post */}
      {menuVisible && menuAnchorPostId === item.id && (
        <PostMenuOverlay
          onSavePost={handleSavePost}
          onHidePost={handleHidePost}
          onReportPost={handleReportPost}
          onClose={handleCloseMenu}
        />
      )}
    </View>
  );

  return (
    <>
      <FlatList
        data={posts}
        renderItem={renderPostItem}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        contentContainerStyle={styles.postsList}
      />
    </>
  );
}

const styles = StyleSheet.create({
  // Seuls les styles qui ne sont pas dans communityStyles
  postsList: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  bookmarkButton: {
    padding: 6,
  },
});