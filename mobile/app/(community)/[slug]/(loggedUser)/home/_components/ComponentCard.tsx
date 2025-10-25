import { getCurrentUser } from '@/lib/mock-data';
import {
  ImageIcon,
  LinkIcon,
  Send,
  Smile,
  Video
} from 'lucide-react-native';
import React from 'react';
import {
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
}

export default function CreatePostCard({
  newPost,
  setNewPost,
  onCreatePost,
}: CreatePostCardProps) {
  const currentUser = getCurrentUser();

  return (
    <View style={styles.createPostCard}>
      <View style={styles.createPostHeader}>
        <Image
          source={{ uri: currentUser?.avatar || "https://via.placeholder.com/48" }}
          style={styles.profilePic}
        />
        <View style={styles.inputWrapper}>
          <TextInput
            multiline
            placeholder="Share your progress, ask questions, or celebrate wins..."
            value={newPost}
            onChangeText={setNewPost}
            style={styles.inputContainer}
            placeholderTextColor="#6b7280"
          />
        </View>
      </View>
      <View style={styles.actionsRow}>
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity style={styles.actionButton}>
            <ImageIcon size={18} color="#6b7280" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Video size={18} color="#6b7280" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <LinkIcon size={18} color="#6b7280" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Smile size={18} color="#6b7280" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity
          style={[
            styles.postButton,
            !newPost.trim() && styles.postButtonDisabled,
          ]}
          onPress={onCreatePost}
          disabled={!newPost.trim()}
        >
          <Send size={16} color="white" style={{ marginRight: 4 }} />
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
