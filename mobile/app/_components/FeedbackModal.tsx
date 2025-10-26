import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Dimensions,
  Animated,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  X, 
  Star, 
  Send,
  Heart,
  ThumbsUp,
  MessageCircle
} from 'lucide-react-native';

import {
  FeedbackModel,
  CreateFeedbackData,
  createFeedback,
  getFeedbackPrompt,
  getModelDisplayName,
  getFeedbackEmoji,
  isValidRating,
} from '../../lib/feedback-api';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../lib/design-tokens';

interface FeedbackModalProps {
  visible: boolean;
  onClose: () => void;
  onFeedbackSubmitted: (feedback: any) => void;
  relatedModel: FeedbackModel;
  relatedTo: string;
  itemTitle?: string;
  existingFeedback?: any; // For editing existing feedback
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function FeedbackModal({ 
  visible, 
  onClose, 
  onFeedbackSubmitted,
  relatedModel,
  relatedTo,
  itemTitle,
  existingFeedback
}: FeedbackModalProps) {
  const [rating, setRating] = useState(existingFeedback?.rating || 0);
  const [comment, setComment] = useState(existingFeedback?.comment || '');
  const [submitting, setSubmitting] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));

  // Reset form when modal opens/closes
  useEffect(() => {
    if (visible) {
      setRating(existingFeedback?.rating || 0);
      setComment(existingFeedback?.comment || '');
      
      // Animate in
      Animated.spring(animatedValue, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    } else {
      // Animate out
      Animated.spring(animatedValue, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }).start();
    }
  }, [visible, existingFeedback]);

  const handleStarPress = (selectedRating: number) => {
    setRating(selectedRating);
    
    // Haptic feedback
    // You can add haptic feedback here if needed
  };

  const handleSubmit = async () => {
    if (!isValidRating(rating)) {
      Alert.alert('Rating Required', 'Please select a rating from 1 to 5 stars.');
      return;
    }

    try {
      setSubmitting(true);
      console.log('⭐ [FEEDBACK-MODAL] Submitting feedback:', { relatedModel, rating });

      const feedbackData: CreateFeedbackData = {
        relatedTo,
        relatedModel,
        rating,
        comment: comment.trim() || undefined,
      };

      const newFeedback = await createFeedback(feedbackData);
      
      console.log('✅ [FEEDBACK-MODAL] Feedback submitted successfully');
      
      onFeedbackSubmitted(newFeedback);
      onClose();
      
      // Show success message
      Alert.alert(
        'Thank You!', 
        `Your ${rating}-star rating has been submitted. We appreciate your feedback!`,
        [{ text: 'OK' }]
      );
      
    } catch (error: any) {
      console.error('💥 [FEEDBACK-MODAL] Error submitting feedback:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to submit feedback. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderStarRating = () => {
    return (
      <View style={styles.starsContainer}>
        <Text style={styles.ratingPrompt}>
          {getFeedbackPrompt(relatedModel)}
        </Text>
        
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              style={styles.starButton}
              onPress={() => handleStarPress(star)}
              activeOpacity={0.7}
            >
              <Animated.View
                style={[
                  styles.starContainer,
                  {
                    transform: [{
                      scale: animatedValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.8, star <= rating ? 1.2 : 1],
                      }),
                    }],
                  },
                ]}
              >
                <Star
                  size={40}
                  color={star <= rating ? '#fbbf24' : colors.gray300}
                  fill={star <= rating ? '#fbbf24' : 'transparent'}
                />
              </Animated.View>
            </TouchableOpacity>
          ))}
        </View>
        
        {rating > 0 && (
          <Animated.View 
            style={[
              styles.ratingFeedback,
              {
                opacity: animatedValue,
                transform: [{
                  translateY: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                }],
              },
            ]}
          >
            <Text style={styles.ratingEmoji}>
              {getFeedbackEmoji(rating)}
            </Text>
            <Text style={styles.ratingText}>
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </Text>
          </Animated.View>
        )}
      </View>
    );
  };

  const renderCommentSection = () => {
    if (rating === 0) return null;

    return (
      <Animated.View 
        style={[
          styles.commentSection,
          {
            opacity: animatedValue,
            transform: [{
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [30, 0],
              }),
            }],
          },
        ]}
      >
        <Text style={styles.commentLabel}>
          Tell us more (optional)
        </Text>
        
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder={`Share your thoughts about this ${getModelDisplayName(relatedModel).toLowerCase()}...`}
            placeholderTextColor={colors.gray500}
            value={comment}
            onChangeText={setComment}
            multiline
            numberOfLines={4}
            maxLength={500}
            textAlignVertical="top"
          />
          
          <View style={styles.commentFooter}>
            <Text style={styles.characterCount}>
              {comment.length}/500
            </Text>
            <MessageCircle size={16} color={colors.gray400} />
          </View>
        </View>
      </Animated.View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <BlurView intensity={50} style={styles.blurOverlay}>
          <SafeAreaView style={styles.safeArea}>
            <Animated.View 
              style={[
                styles.modalContainer,
                {
                  opacity: animatedValue,
                  transform: [{
                    scale: animatedValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.9, 1],
                    }),
                  }],
                },
              ]}
            >
              <BlurView intensity={95} style={styles.modalContent}>
                {/* Header */}
                <LinearGradient
                  colors={[colors.primary, '#9c88ff']}
                  style={styles.header}
                >
                  <View style={styles.headerContent}>
                    <View style={styles.headerInfo}>
                      <Heart size={24} color={colors.white} />
                      <View style={styles.headerText}>
                        <Text style={styles.headerTitle}>Rate & Review</Text>
                        <Text style={styles.headerSubtitle}>
                          {itemTitle || `${getModelDisplayName(relatedModel)}`}
                        </Text>
                      </View>
                    </View>
                    
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={onClose}
                      activeOpacity={0.7}
                    >
                      <X size={24} color={colors.white} />
                    </TouchableOpacity>
                  </View>
                </LinearGradient>

                {/* Content */}
                <ScrollView 
                  style={styles.scrollContent}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.scrollContainer}
                >
                  {renderStarRating()}
                  {renderCommentSection()}
                </ScrollView>

                {/* Footer */}
                {rating > 0 && (
                  <Animated.View 
                    style={[
                      styles.footer,
                      {
                        opacity: animatedValue,
                        transform: [{
                          translateY: animatedValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [50, 0],
                          }),
                        }],
                      },
                    ]}
                  >
                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={handleSubmit}
                      disabled={submitting}
                      activeOpacity={0.8}
                    >
                      <LinearGradient
                        colors={[colors.primary, '#9c88ff']}
                        style={styles.submitButtonGradient}
                      >
                        {submitting ? (
                          <ActivityIndicator size="small" color={colors.white} />
                        ) : (
                          <>
                            <Send size={20} color={colors.white} />
                            <Text style={styles.submitButtonText}>
                              {existingFeedback ? 'Update Review' : 'Submit Review'}
                            </Text>
                          </>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>
                )}
              </BlurView>
            </Animated.View>
          </SafeAreaView>
        </BlurView>
      </View>
    </Modal>
  );
}

const styles = {
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  blurOverlay: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingHorizontal: spacing.lg,
  },
  modalContainer: {
    width: '100%' as const,
    maxWidth: 400,
    maxHeight: screenHeight * 0.8,
    borderRadius: borderRadius.xl,
    overflow: 'hidden' as const,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 12,
  },
  modalContent: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    flex: 1,
  },

  // Header
  header: {
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  headerInfo: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    flex: 1,
  },
  headerText: {
    marginLeft: spacing.md,
    flex: 1,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as any,
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: fontSize.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },

  // Content
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    paddingVertical: spacing.xl,
  },

  // Stars
  starsContainer: {
    alignItems: 'center' as const,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  ratingPrompt: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.gray800,
    textAlign: 'center' as const,
    marginBottom: spacing.xl,
  },
  starsRow: {
    flexDirection: 'row' as const,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    marginBottom: spacing.lg,
  },
  starButton: {
    padding: spacing.sm,
  },
  starContainer: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  ratingFeedback: {
    alignItems: 'center' as const,
  },
  ratingEmoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  ratingText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: colors.gray700,
  },

  // Comment
  commentSection: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  commentLabel: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: colors.gray800,
    marginBottom: spacing.md,
  },
  commentInputContainer: {
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.gray200,
  },
  commentInput: {
    padding: spacing.md,
    fontSize: fontSize.base,
    color: colors.gray800,
    minHeight: 100,
    textAlignVertical: 'top' as const,
  },
  commentFooter: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  characterCount: {
    fontSize: fontSize.xs,
    color: colors.gray500,
  },

  // Footer
  footer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  submitButton: {
    borderRadius: borderRadius.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  submitButtonGradient: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.lg,
  },
  submitButtonText: {
    marginLeft: spacing.sm,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: colors.white,
  },
};
