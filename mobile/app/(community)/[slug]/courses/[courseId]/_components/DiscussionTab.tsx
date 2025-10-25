import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles';

interface DiscussionTabProps {}

export const DiscussionTab: React.FC<DiscussionTabProps> = () => {
  return (
    <View style={styles.tabContent}>
      <View style={styles.discussionCard}>
        <View style={styles.discussionHeader}>
          <Text style={styles.discussionTitle}>Discussion</Text>
          <Text style={styles.discussionDescription}>
            Ask questions and share insights
          </Text>
        </View>

        <View style={styles.commentContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <View style={styles.commentContent}>
            <View style={styles.commentBubble}>
              <Text style={styles.commentText}>
                Great explanation of React components! The examples really helped me
                understand the concept.
              </Text>
            </View>
            <View style={styles.commentMeta}>
              <Text style={styles.commentAuthor}>John Doe • 2 hours ago</Text>
              <View style={styles.commentActions}>
                <TouchableOpacity style={styles.commentAction}>
                  <Text style={styles.commentActionText}>Reply</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.commentAction}>
                  <Text style={styles.commentActionText}>Like</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
