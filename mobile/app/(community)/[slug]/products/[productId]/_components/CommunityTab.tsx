import { MessageCircle, Users } from 'lucide-react-native';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles';

interface Comment {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  text: string;
  createdAt: string;
  likes: number;
  isLiked: boolean;
}

interface CommunityTabProps {
  comments: Comment[];
  userIsMember: boolean;
  onJoinCommunity: () => void;
  onLikeComment: (commentId: string) => void;
  onReplyToComment: (commentId: string) => void;
}

export const CommunityTab: React.FC<CommunityTabProps> = ({ 
  comments, 
  userIsMember, 
  onJoinCommunity, 
  onLikeComment, 
  onReplyToComment 
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Il y a quelques minutes';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 168) return `Il y a ${Math.floor(diffInHours / 24)}j`;
    return date.toLocaleDateString('fr-FR');
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentContainer}>
      <View style={styles.comment}>
        <View style={styles.commentHeader}>
          <View style={styles.commentAvatar}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#6366f1' }}>
              {item.user.name[0].toUpperCase()}
            </Text>
          </View>
          <View style={styles.commentInfo}>
            <Text style={styles.commentText}>{item.text}</Text>
            <View style={styles.commentActions}>
              <Text style={styles.commentMeta}>
                {item.user.name} • {formatDate(item.createdAt)}
              </Text>
              <TouchableOpacity onPress={() => onLikeComment(item.id)}>
                <Text style={[
                  styles.commentAction,
                  item.isLiked && { color: '#ef4444' }
                ]}>
                  ♥ {item.likes}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => onReplyToComment(item.id)}>
                <Text style={styles.commentAction}>Répondre</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  if (!userIsMember) {
    return (
      <View style={styles.tabContent}>
        <View style={styles.card}>
          <View style={{ alignItems: 'center', padding: 20 }}>
            <Users size={48} color="#d1d5db" />
            <Text style={styles.cardTitle}>Rejoignez la communauté</Text>
            <Text style={styles.cardText}>
              Rejoignez cette communauté pour accéder aux discussions, poser des questions 
              et partager vos expériences avec d'autres membres.
            </Text>
            <TouchableOpacity 
              style={styles.joinButton}
              onPress={onJoinCommunity}
            >
              <Users size={16} color="#6366f1" />
              <Text style={styles.joinButtonText}>Rejoindre la communauté</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.tabContent}>
      {comments.length === 0 ? (
        <View style={styles.card}>
          <View style={{ alignItems: 'center', padding: 20 }}>
            <MessageCircle size={48} color="#d1d5db" />
            <Text style={styles.cardTitle}>Aucun commentaire</Text>
            <Text style={styles.cardText}>
              Soyez le premier à commenter ce produit et à partager votre expérience !
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            Commentaires ({comments.length})
          </Text>
          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>
      )}
    </View>
  );
};
