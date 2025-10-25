import { Lock, PlayCircle } from 'lucide-react-native';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles';

interface VideoPlayerProps {
  currentChapter: any;
  course: any;
  enrollment: any;
  isChapterAccessible: (chapterId: string) => boolean;
  openVideoUrl: (url?: string) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  currentChapter,
  course,
  enrollment,
  isChapterAccessible,
  openVideoUrl,
}) => {
  return (
    <View style={styles.videoContainer}>
      {currentChapter?.videoUrl && isChapterAccessible(currentChapter.id) ? (
        <TouchableOpacity
          style={styles.videoPreview}
          onPress={() => openVideoUrl(currentChapter.videoUrl)}
        >
          <Image
            source={{ uri: course.thumbnail || 'https://picsum.photos/800/600' }}
            style={styles.videoThumbnail}
          />
          <View style={styles.playButtonOverlay}>
            <PlayCircle size={48} color="#fff" />
          </View>
        </TouchableOpacity>
      ) : (
        <View style={styles.videoPlaceholder}>
          {currentChapter?.isPreview && !enrollment ? (
            <View style={styles.placeholderContent}>
              <PlayCircle size={48} color="#fff" opacity={0.7} />
              <Text style={styles.placeholderTitle}>Preview Available</Text>
              <Text style={styles.placeholderText}>
                Enroll to unlock full course content
              </Text>
              <TouchableOpacity style={styles.enrollButton}>
                <Text style={styles.enrollButtonText}>Enroll Now</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.placeholderContent}>
              <Lock size={48} color="#fff" opacity={0.7} />
              <Text style={styles.placeholderTitle}>Chapter Locked</Text>
              <Text style={styles.placeholderText}>
                Enroll in the course to access this content
              </Text>
              <TouchableOpacity style={styles.enrollButton}>
                <Text style={styles.enrollButtonText}>Enroll Now</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
};
