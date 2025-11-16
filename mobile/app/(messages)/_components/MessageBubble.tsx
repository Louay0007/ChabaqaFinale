import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  User,
  Download,
  FileText,
  Image as ImageIcon,
  Play,
  ExternalLink
} from 'lucide-react-native';

import {
  DMMessage,
  DMConversation,
  MessageAttachment,
  formatMessageTime,
  isMyMessage,
  getSenderDisplayName,
} from '../../../lib/dm-api';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../../lib/design-tokens';

interface MessageBubbleProps {
  message: DMMessage;
  isFromMe: boolean;
  showAvatar: boolean;
  showTimestamp: boolean;
  showSenderName?: boolean;
  conversation: DMConversation | null;
  currentUserId: string;
}

export default function MessageBubble({ 
  message, 
  isFromMe, 
  showAvatar, 
  showTimestamp,
  showSenderName = false,
  conversation,
  currentUserId 
}: MessageBubbleProps) {

  const senderName = getSenderDisplayName(message, currentUserId, conversation);

  const handleAttachmentPress = async (attachment: MessageAttachment) => {
    try {
      if (attachment.type === 'image') {
        // TODO: Open image viewer
        console.log('Opening image:', attachment.url);
      } else {
        // Open external link or download
        await Linking.openURL(attachment.url);
      }
    } catch (error) {
      Alert.alert('Error', 'Unable to open attachment');
    }
  };

  const renderAttachment = (attachment: MessageAttachment, index: number) => {
    const getAttachmentIcon = () => {
      switch (attachment.type) {
        case 'image':
          return <ImageIcon size={16} color={colors.white} />;
        case 'video':
          return <Play size={16} color={colors.white} />;
        default:
          return <FileText size={16} color={colors.white} />;
      }
    };

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    if (attachment.type === 'image') {
      return (
        <TouchableOpacity
          key={index}
          style={styles.imageAttachment}
          onPress={() => handleAttachmentPress(attachment)}
          activeOpacity={0.8}
        >
          <Image
            source={{ uri: attachment.url }}
            style={styles.attachmentImage}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay}>
            <ImageIcon size={16} color={colors.white} />
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.fileAttachment,
          isFromMe ? styles.myFileAttachment : styles.theirFileAttachment
        ]}
        onPress={() => handleAttachmentPress(attachment)}
        activeOpacity={0.8}
      >
        <View style={styles.fileIcon}>
          {getAttachmentIcon()}
        </View>
        <View style={styles.fileInfo}>
          <Text style={[
            styles.fileName,
            isFromMe ? styles.myFileName : styles.theirFileName
          ]} numberOfLines={1}>
            {attachment.type.toUpperCase()} File
          </Text>
          <Text style={[
            styles.fileSize,
            isFromMe ? styles.myFileSize : styles.theirFileSize
          ]}>
            {formatFileSize(attachment.size)} • Tap to open
          </Text>
        </View>
        <ExternalLink 
          size={14} 
          color={isFromMe ? colors.white : colors.primary} 
        />
      </TouchableOpacity>
    );
  };

  const renderAvatar = () => {
    if (!showAvatar || isFromMe) return <View style={styles.avatarSpacer} />;

    // Check if we have admin photo for help conversation
    const avatarUrl = conversation?.type === 'HELP_DM' && conversation.participantB?.photo_profil;
    
    return (
      <View style={styles.avatarContainer}>
        <LinearGradient
          colors={
            conversation?.type === 'HELP_DM'
              ? ['#4CAF50', '#45a049'] // Green for support
              : [colors.primary, '#9c88ff']
          }
          style={styles.avatarGradient}
        >
          <View style={styles.avatar}>
            {avatarUrl ? (
              <Image
                source={{ uri: avatarUrl }}
                style={styles.avatarImage}
              />
            ) : (
              <User size={16} color={colors.white} />
            )}
          </View>
        </LinearGradient>
      </View>
    );
  };

  const renderMessageStatus = () => {
    if (!isFromMe) return null;

    return (
      <View style={styles.messageStatus}>
        {message.readAt ? (
          <View style={styles.readIndicator}>
            <Text style={styles.statusText}>Read</Text>
          </View>
        ) : (
          <View style={styles.sentIndicator}>
            <Text style={styles.statusText}>Sent</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[
      styles.container,
      isFromMe ? styles.myMessageContainer : styles.theirMessageContainer
    ]}>
      {/* Avatar (for incoming messages) */}
      {renderAvatar()}

      {/* Message Content */}
      <View style={[
        styles.messageWrapper,
        isFromMe ? styles.myMessageWrapper : styles.theirMessageWrapper
      ]}>
        {/* Sender Name */}
        {showSenderName && !isFromMe && (
          <Text style={styles.senderName}>
            {senderName}
            {conversation?.type === 'HELP_DM' && conversation.participantB?.poste && (
              <Text style={styles.senderRole}> • {conversation.participantB.poste}</Text>
            )}
          </Text>
        )}

        {/* Message Bubble */}
        <View style={[
          styles.messageBubble,
          isFromMe ? styles.myMessageBubble : styles.theirMessageBubble,
          conversation?.type === 'HELP_DM' && !isFromMe ? styles.helpMessageBubble : null
        ]}>
          {isFromMe ? (
            <LinearGradient
              colors={[colors.primary, '#9c88ff']}
              style={styles.myMessageGradient}
            >
              {/* Text Content */}
              {message.text && (
                <Text style={styles.myMessageText}>
                  {message.text}
                </Text>
              )}
              
              {/* Attachments */}
              {message.attachments && message.attachments.length > 0 && (
                <View style={styles.attachmentsContainer}>
                  {message.attachments.map(renderAttachment)}
                </View>
              )}
            </LinearGradient>
          ) : (
            <View style={styles.theirMessageContent}>
              {/* Text Content */}
              {message.text && (
                <Text style={styles.theirMessageText}>
                  {message.text}
                </Text>
              )}
              
              {/* Attachments */}
              {message.attachments && message.attachments.length > 0 && (
                <View style={styles.attachmentsContainer}>
                  {message.attachments.map(renderAttachment)}
                </View>
              )}
            </View>
          )}
        </View>

        {/* Timestamp and Status */}
        {showTimestamp && (
          <View style={[
            styles.timestampContainer,
            isFromMe ? styles.myTimestampContainer : styles.theirTimestampContainer
          ]}>
            <Text style={styles.timestamp}>
              {formatMessageTime(message.createdAt)}
            </Text>
            {renderMessageStatus()}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = {
  container: {
    flexDirection: 'row' as const,
    marginVertical: 2,
    paddingHorizontal: spacing.xs,
  },
  myMessageContainer: {
    justifyContent: 'flex-end' as const,
  },
  theirMessageContainer: {
    justifyContent: 'flex-start' as const,
  },

  // Avatar
  avatarContainer: {
    marginRight: spacing.sm,
    marginTop: spacing.xs,
  },
  avatarSpacer: {
    width: 32,
    marginRight: spacing.sm,
  },
  avatarGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    padding: 2,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    overflow: 'hidden' as const,
  },
  avatarImage: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },

  // Message Wrapper
  messageWrapper: {
    maxWidth: '75%' as const,
    marginVertical: 1,
  },
  myMessageWrapper: {
    alignItems: 'flex-end' as const,
  },
  theirMessageWrapper: {
    alignItems: 'flex-start' as const,
  },

  // Message Bubble
  messageBubble: {
    borderRadius: borderRadius.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  myMessageBubble: {
    borderBottomRightRadius: 6,
  },
  theirMessageBubble: {
    borderBottomLeftRadius: 6,
    backgroundColor: colors.white,
  },

  // Message Content
  myMessageGradient: {
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderBottomRightRadius: 6,
  },
  theirMessageContent: {
    padding: spacing.md,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    borderBottomLeftRadius: 6,
  },

  // Text Styles
  myMessageText: {
    fontSize: fontSize.base,
    color: colors.white,
    lineHeight: 20,
  },
  theirMessageText: {
    fontSize: fontSize.base,
    color: colors.gray800,
    lineHeight: 20,
  },

  // Attachments
  attachmentsContainer: {
    marginTop: spacing.xs,
  },
  
  // Image Attachment
  imageAttachment: {
    position: 'relative' as const,
    borderRadius: borderRadius.md,
    overflow: 'hidden' as const,
    marginTop: spacing.xs,
  },
  attachmentImage: {
    width: 200,
    height: 150,
  },
  imageOverlay: {
    position: 'absolute' as const,
    top: spacing.xs,
    right: spacing.xs,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 12,
    padding: 4,
  },

  // File Attachment
  fileAttachment: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    marginTop: spacing.xs,
    minWidth: 200,
  },
  myFileAttachment: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  theirFileAttachment: {
    backgroundColor: colors.gray100,
  },
  fileIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: spacing.sm,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium as any,
    marginBottom: 2,
  },
  myFileName: {
    color: colors.white,
  },
  theirFileName: {
    color: colors.gray800,
  },
  fileSize: {
    fontSize: fontSize.xs,
  },
  myFileSize: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  theirFileSize: {
    color: colors.gray500,
  },

  // Timestamp
  timestampContainer: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginTop: 4,
    paddingHorizontal: spacing.xs,
  },
  myTimestampContainer: {
    justifyContent: 'flex-end' as const,
  },
  theirTimestampContainer: {
    justifyContent: 'flex-start' as const,
  },
  timestamp: {
    fontSize: fontSize.xs,
    color: colors.gray500,
  },

  // Message Status
  messageStatus: {
    marginLeft: spacing.xs,
  },
  readIndicator: {
    backgroundColor: colors.success,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  sentIndicator: {
    backgroundColor: colors.gray400,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  statusText: {
    fontSize: fontSize.xs - 1,
    color: colors.white,
    fontWeight: fontWeight.medium as any,
  },

  // Sender Name Styles
  senderName: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold as any,
    color: colors.gray700,
    marginBottom: 4,
    marginLeft: spacing.xs,
  },
  senderRole: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.normal as any,
    color: colors.gray500,
  },

  // Help Message Styles
  helpMessageBubble: {
    borderWidth: 1,
    borderColor: '#E8F5E8',
    backgroundColor: '#F1F8E9',
  },
};
