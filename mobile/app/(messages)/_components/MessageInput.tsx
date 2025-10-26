import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Alert,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { 
  Send, 
  Plus, 
  Camera, 
  Image as ImageIcon,
  Paperclip,
  Mic,
  X
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';

import { uploadAttachment } from '../../../lib/dm-api';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../../lib/design-tokens';

interface MessageInputProps {
  onSendMessage: (text: string) => void;
  sending: boolean;
  conversationId: string;
}

export default function MessageInput({ onSendMessage, sending, conversationId }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  
  const textInputRef = useRef<TextInput>(null);
  const slideAnimation = useRef(new Animated.Value(0)).current;

  // Handle send message
  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || sending) return;

    onSendMessage(trimmedMessage);
    setMessage('');
    textInputRef.current?.blur();
  };

  // Toggle attachment options
  const toggleAttachmentOptions = () => {
    const toValue = showAttachmentOptions ? 0 : 1;
    
    setShowAttachmentOptions(!showAttachmentOptions);
    
    Animated.spring(slideAnimation, {
      toValue,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  // Handle image picker
  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to send images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        await handleFileUpload(result.assets[0]);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to select image');
    } finally {
      setShowAttachmentOptions(false);
    }
  };

  // Handle camera
  const handleCamera = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        await handleFileUpload(result.assets[0]);
      }
    } catch (error) {
      console.error('Camera error:', error);
      Alert.alert('Error', 'Failed to take photo');
    } finally {
      setShowAttachmentOptions(false);
    }
  };

  // Handle document picker
  const handleDocumentPicker = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        await handleFileUpload(result.assets[0]);
      }
    } catch (error) {
      console.error('Document picker error:', error);
      Alert.alert('Error', 'Failed to select document');
    } finally {
      setShowAttachmentOptions(false);
    }
  };

  // Handle file upload
  const handleFileUpload = async (file: any) => {
    try {
      setUploadingAttachment(true);
      console.log('📎 [MESSAGE-INPUT] Uploading attachment:', file.name || file.fileName);

      // Create FormData compatible file object
      const fileToUpload = {
        uri: file.uri,
        type: file.type || file.mimeType || 'application/octet-stream',
        name: file.name || file.fileName || 'attachment',
      };

      await uploadAttachment(conversationId, fileToUpload);
      
      console.log('✅ [MESSAGE-INPUT] Attachment uploaded successfully');
    } catch (error: any) {
      console.error('💥 [MESSAGE-INPUT] Error uploading attachment:', error);
      Alert.alert(
        'Upload Error',
        error.message || 'Failed to upload attachment. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setUploadingAttachment(false);
    }
  };

  const renderAttachmentOptions = () => (
    <Animated.View 
      style={[
        styles.attachmentOptions,
        {
          transform: [{
            translateY: slideAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: [60, 0],
            }),
          }],
          opacity: slideAnimation,
        },
      ]}
    >
      <BlurView intensity={95} style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.attachmentButton}
          onPress={handleCamera}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#4CAF50', '#45a049']}
            style={styles.attachmentButtonGradient}
          >
            <Camera size={20} color={colors.white} />
          </LinearGradient>
          <Text style={styles.attachmentButtonText}>Camera</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.attachmentButton}
          onPress={handleImagePicker}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#2196F3', '#1976D2']}
            style={styles.attachmentButtonGradient}
          >
            <ImageIcon size={20} color={colors.white} />
          </LinearGradient>
          <Text style={styles.attachmentButtonText}>Photos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.attachmentButton}
          onPress={handleDocumentPicker}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FF9800', '#F57C00']}
            style={styles.attachmentButtonGradient}
          >
            <Paperclip size={20} color={colors.white} />
          </LinearGradient>
          <Text style={styles.attachmentButtonText}>Files</Text>
        </TouchableOpacity>
      </BlurView>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      {/* Attachment Options */}
      {showAttachmentOptions && renderAttachmentOptions()}

      {/* Uploading Indicator */}
      {uploadingAttachment && (
        <View style={styles.uploadingContainer}>
          <BlurView intensity={90} style={styles.uploadingContent}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.uploadingText}>Uploading attachment...</Text>
          </BlurView>
        </View>
      )}

      {/* Main Input Container */}
      <BlurView intensity={95} style={styles.inputContainer}>
        <View style={styles.inputRow}>
          {/* Attachment Button */}
          <TouchableOpacity
            style={styles.actionButton}
            onPress={toggleAttachmentOptions}
            activeOpacity={0.7}
          >
            {showAttachmentOptions ? (
              <X size={20} color={colors.primary} />
            ) : (
              <Plus size={20} color={colors.primary} />
            )}
          </TouchableOpacity>

          {/* Text Input */}
          <View style={styles.textInputContainer}>
            <TextInput
              ref={textInputRef}
              style={styles.textInput}
              placeholder="Type a message..."
              placeholderTextColor={colors.gray500}
              value={message}
              onChangeText={setMessage}
              multiline
              maxLength={1000}
              returnKeyType="send"
              onSubmitEditing={handleSend}
              blurOnSubmit={false}
              scrollEnabled={true}
            />
          </View>

          {/* Send Button */}
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!message.trim() || sending) && styles.sendButtonDisabled
            ]}
            onPress={handleSend}
            disabled={!message.trim() || sending}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                message.trim() && !sending
                  ? [colors.primary, '#9c88ff']
                  : [colors.gray400, colors.gray500]
              }
              style={styles.sendButtonGradient}
            >
              {sending ? (
                <ActivityIndicator size="small" color={colors.white} />
              ) : (
                <Send size={18} color={colors.white} />
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Character Count */}
        {message.length > 800 && (
          <View style={styles.characterCount}>
            <Text style={[
              styles.characterCountText,
              message.length >= 1000 && styles.characterCountWarning
            ]}>
              {message.length}/1000
            </Text>
          </View>
        )}
      </BlurView>
    </View>
  );
}

const styles = {
  container: {
    backgroundColor: colors.gray50,
    paddingTop: spacing.sm,
  },

  // Attachment Options
  attachmentOptions: {
    position: 'absolute' as const,
    bottom: '100%' as const,
    left: spacing.lg,
    right: spacing.lg,
    marginBottom: spacing.sm,
  },
  optionsContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  attachmentButton: {
    alignItems: 'center' as const,
  },
  attachmentButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: spacing.xs,
  },
  attachmentButtonText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium as any,
    color: colors.gray700,
  },

  // Uploading Indicator
  uploadingContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.sm,
  },
  uploadingContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  uploadingText: {
    marginLeft: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.gray600,
    fontWeight: fontWeight.medium as any,
  },

  // Main Input
  inputContainer: {
    marginHorizontal: spacing.lg,
    marginBottom: Platform.OS === 'ios' ? spacing.lg : spacing.md,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: borderRadius.xl,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputRow: {
    flexDirection: 'row' as const,
    alignItems: 'flex-end' as const,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  // Action Button
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginRight: spacing.sm,
    marginBottom: 2,
  },

  // Text Input
  textInputContainer: {
    flex: 1,
    maxHeight: 100,
  },
  textInput: {
    fontSize: fontSize.base,
    color: colors.gray800,
    lineHeight: 20,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.gray50,
    borderRadius: borderRadius.lg,
    textAlignVertical: 'center' as const,
  },

  // Send Button
  sendButton: {
    marginLeft: spacing.sm,
    marginBottom: 2,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },

  // Character Count
  characterCount: {
    alignItems: 'flex-end' as const,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xs,
  },
  characterCountText: {
    fontSize: fontSize.xs,
    color: colors.gray500,
  },
  characterCountWarning: {
    color: colors.warning,
    fontWeight: fontWeight.medium as any,
  },
};
