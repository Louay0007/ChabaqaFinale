import { getCurrentUser } from '@/lib/mock-data';
import {
  ImageIcon,
  LinkIcon,
  Send,
  Smile,
  Video,
  Loader2
} from 'lucide-react-native';
import React from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { styles } from '../styles';

interface CreatePostCardProps {
  newPost: string;
  setNewPost: (text: string) => void;
  onCreatePost: () => void;
  creatingPost?: boolean;
}

export default function CreatePostCard({
  newPost,
  setNewPost,
  onCreatePost,
  creatingPost = false,
}: CreatePostCardProps) {
  const currentUser = getCurrentUser();

  return (
    <View style={styles.createPostCard}>
      {/* User Profile Section */}
      <View style={styles.createPostHeader}>
        <Image
          source={{ uri: currentUser?.avatar || "https://via.placeholder.com/48" }}
          style={styles.profilePic}
        />
        <View style={styles.userInfoSection}>
          <Text style={styles.userName}>{currentUser?.name || 'User'}</Text>
          <Text style={styles.userRole}>{currentUser?.role || 'Member'}</Text>
        </View>
      </View>

      {/* Input Area */}
      <View style={styles.inputWrapper}>
        <TextInput
          multiline
          placeholder={`What's on your mind, ${currentUser?.name?.split(' ')[0] || 'there'}?`}
          value={newPost}
          onChangeText={setNewPost}
          style={styles.inputContainer}
          placeholderTextColor="#9ca3af"
          editable={!creatingPost}
        />
      </View>

      {/* Action Buttons Row */}
      <View style={styles.actionsRow}>
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            disabled={creatingPost}
          >
            <ImageIcon size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            disabled={creatingPost}
          >
            <Video size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            disabled={creatingPost}
          >
            <LinkIcon size={20} color="#6b7280" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            disabled={creatingPost}
          >
            <Smile size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* Post Button */}
        <TouchableOpacity
          style={[
            styles.postButton,
            (!newPost.trim() || creatingPost) && styles.postButtonDisabled,
          ]}
          onPress={onCreatePost}
          disabled={!newPost.trim() || creatingPost}
        >
          {creatingPost ? (
            <>
              <ActivityIndicator size="small" color="white" style={{ marginRight: 6 }} />
              <Text style={styles.postButtonText}>Posting...</Text>
            </>
          ) : (
            <>
              <Send size={16} color="white" style={{ marginRight: 6 }} />
              <Text style={styles.postButtonText}>Post</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
