import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Image,
  ImageBackground,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  Tag, 
  Eye, 
  Send,
  X,
  Camera,
  Plus
} from 'lucide-react-native';

import { ThemedView } from '../../../../../_components/ThemedView';
import { useAuth } from '../../../../../hooks/use-auth';
import { CreatePostData, createPost } from '../../../../../lib/post-api';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../../../../lib/design-tokens';

export default function CreatePostScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { user } = useAuth();

  // Form state
  const [formData, setFormData] = useState<CreatePostData>({
    title: '',
    content: '',
    excerpt: '',
    thumbnail: '',
    communityId: slug as string,
    tags: [],
  });
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [tagInput, setTagInput] = useState('');
  const [contentHeight, setContentHeight] = useState(120);

  // Refs
  const titleRef = useRef<TextInput>(null);
  const contentRef = useRef<TextInput>(null);

  // Form validation
  const isFormValid = () => {
    return formData.title.trim().length >= 3 && 
           formData.content.trim().length >= 10;
  };

  // Handle input changes
  const updateFormData = (field: keyof CreatePostData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle image picker
  const handleImagePicker = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant camera roll permissions to add images.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setSelectedImage(result.assets[0].uri);
        updateFormData('thumbnail', result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  // Handle tag addition
  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag) && formData.tags.length < 5) {
      updateFormData('tags', [...formData.tags, tag]);
      setTagInput('');
    }
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove: string) => {
    updateFormData('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  // Handle post creation
  const handleCreatePost = async () => {
    if (!isFormValid()) {
      Alert.alert('Invalid Form', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    
    try {
      console.log('✍️ [CREATE-POST] Creating post...');
      
      // Generate excerpt if not provided
      const finalFormData = {
        ...formData,
        excerpt: formData.excerpt || formData.content.substring(0, 150) + '...',
      };

      const newPost = await createPost(finalFormData);
      
      console.log('✅ [CREATE-POST] Post created successfully');
      
      Alert.alert(
        'Success!',
        'Your post has been published successfully.',
        [
          {
            text: 'View Post',
            onPress: () => {
              router.replace(`/(community)/${slug}/feed/${newPost.id}`);
            }
          }
        ]
      );
    } catch (error: any) {
      console.error('💥 [CREATE-POST] Error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to create post. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Render header
  const renderHeader = () => (
    <ImageBackground
      source={require('../../../../../assets/images/background.png')}
      style={styles.headerBackground}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(142, 120, 251, 0.9)', 'rgba(142, 120, 251, 0.7)']}
        style={styles.headerOverlay}
      >
        <SafeAreaView style={styles.headerContent}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color={colors.white} />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>Create Post</Text>
            
            <TouchableOpacity
              style={styles.previewButton}
              onPress={() => setShowPreview(!showPreview)}
            >
              <Eye size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </ImageBackground>
  );

  // Render form
  const renderForm = () => (
    <View style={styles.formContainer}>
      {/* Title Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Title *</Text>
        <BlurView intensity={95} style={styles.inputCard}>
          <TextInput
            ref={titleRef}
            style={styles.titleInput}
            placeholder="What's your post about?"
            placeholderTextColor={colors.gray500}
            value={formData.title}
            onChangeText={(text) => updateFormData('title', text)}
            maxLength={200}
            returnKeyType="next"
            onSubmitEditing={() => contentRef.current?.focus()}
          />
          <Text style={styles.charCount}>{formData.title.length}/200</Text>
        </BlurView>
      </View>

      {/* Content Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Content *</Text>
        <BlurView intensity={95} style={styles.inputCard}>
          <TextInput
            ref={contentRef}
            style={[styles.contentInput, { height: Math.max(120, contentHeight) }]}
            placeholder="Share your thoughts, insights, or stories..."
            placeholderTextColor={colors.gray500}
            value={formData.content}
            onChangeText={(text) => updateFormData('content', text)}
            multiline
            textAlignVertical="top"
            onContentSizeChange={(e) => setContentHeight(e.nativeEvent.contentSize.height)}
          />
        </BlurView>
      </View>

      {/* Excerpt Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Excerpt (Optional)</Text>
        <BlurView intensity={95} style={styles.inputCard}>
          <TextInput
            style={styles.excerptInput}
            placeholder="Brief summary for preview..."
            placeholderTextColor={colors.gray500}
            value={formData.excerpt}
            onChangeText={(text) => updateFormData('excerpt', text)}
            maxLength={150}
          />
          <Text style={styles.charCount}>{formData.excerpt.length}/150</Text>
        </BlurView>
      </View>

      {/* Image Upload */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Thumbnail Image</Text>
        {selectedImage ? (
          <View style={styles.imagePreviewContainer}>
            <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => {
                setSelectedImage('');
                updateFormData('thumbnail', '');
              }}
            >
              <X size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.imageUpload} onPress={handleImagePicker}>
            <LinearGradient
              colors={['rgba(142, 120, 251, 0.1)', 'rgba(156, 136, 255, 0.05)']}
              style={styles.imageUploadContent}
            >
              <Camera size={32} color={colors.primary} />
              <Text style={styles.imageUploadText}>Add Image</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
      </View>

      {/* Tags */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Tags</Text>
        <BlurView intensity={95} style={styles.inputCard}>
          <View style={styles.tagInputContainer}>
            <TextInput
              style={styles.tagInput}
              placeholder="Add tags (press + to add)"
              placeholderTextColor={colors.gray500}
              value={tagInput}
              onChangeText={setTagInput}
              onSubmitEditing={handleAddTag}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={styles.addTagButton}
              onPress={handleAddTag}
              disabled={!tagInput.trim()}
            >
              <Plus size={16} color={tagInput.trim() ? colors.primary : colors.gray400} />
            </TouchableOpacity>
          </View>
          
          {formData.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {formData.tags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.tag}
                  onPress={() => handleRemoveTag(tag)}
                >
                  <Text style={styles.tagText}>#{tag}</Text>
                  <X size={12} color={colors.primary} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </BlurView>
      </View>
    </View>
  );

  // Render publish button
  const renderPublishButton = () => (
    <View style={styles.publishContainer}>
      <TouchableOpacity
        style={[styles.publishButton, !isFormValid() && styles.disabledButton]}
        onPress={handleCreatePost}
        disabled={!isFormValid() || loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isFormValid() ? [colors.primary, '#9c88ff'] : [colors.gray400, colors.gray500]}
          style={styles.publishButtonGradient}
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <>
              <Send size={20} color={colors.white} />
              <Text style={styles.publishButtonText}>Publish Post</Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        {renderHeader()}
        
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderForm()}
        </ScrollView>

        {renderPublishButton()}
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  keyboardAvoid: {
    flex: 1,
  },

  // Header
  headerBackground: {
    height: 120,
  },
  headerOverlay: {
    flex: 1,
  },
  headerContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingBottom: spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as any,
    color: colors.white,
  },
  previewButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Scroll View
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100, // Space for publish button
  },

  // Form
  formContainer: {
    padding: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold as any,
    color: colors.gray700,
    marginBottom: spacing.sm,
  },
  inputCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  // Input Styles
  titleInput: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold as any,
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  contentInput: {
    fontSize: fontSize.base,
    color: colors.gray800,
    lineHeight: 22,
  },
  excerptInput: {
    fontSize: fontSize.base,
    color: colors.gray800,
    marginBottom: spacing.xs,
  },
  charCount: {
    fontSize: fontSize.xs,
    color: colors.gray500,
    textAlign: 'right',
  },

  // Image Upload
  imageUpload: {
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  imageUploadContent: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(142, 120, 251, 0.2)',
    borderStyle: 'dashed',
    borderRadius: borderRadius.lg,
  },
  imageUploadText: {
    marginTop: spacing.sm,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium as any,
    color: colors.primary,
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 200,
  },
  removeImageButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Tags
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  tagInput: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.gray800,
  },
  addTagButton: {
    padding: spacing.xs,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
  },
  tagText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    marginRight: spacing.xs,
  },

  // Publish Button
  publishContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  publishButton: {
    borderRadius: borderRadius.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  disabledButton: {
    shadowOpacity: 0.1,
  },
  publishButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.lg,
  },
  publishButtonText: {
    marginLeft: spacing.sm,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: colors.white,
  },
};
