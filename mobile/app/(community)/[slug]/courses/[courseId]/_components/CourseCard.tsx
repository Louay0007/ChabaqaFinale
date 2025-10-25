import { CheckCircle, Lock, PlayCircle } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles';

interface ChaptersCardProps {
  course: any;
  selectedChapter: string | null;
  setSelectedChapter: (chapterId: string) => void;
  enrollment: any;
  isChapterAccessible: (chapterId: string) => boolean;
  formatTime: (minutes: number) => string;
}

export const ChaptersCard: React.FC<ChaptersCardProps> = ({
  course,
  selectedChapter,
  setSelectedChapter,
  enrollment,
  isChapterAccessible,
  formatTime,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>Course Content</Text>
      </View>
      <View style={styles.cardContent}>
        <ScrollView style={styles.chapterList} nestedScrollEnabled>
          {course.sections.map((section: any) => (
            <View key={section.id} style={styles.sectionItem}>
              <Text style={styles.sectionItemTitle}>{section.title}</Text>
              <View style={styles.chapterItems}>
                {section.chapters.map((chapter: any) => {
                  const isCompleted = enrollment?.progress.find(
                    (p: any) => p.chapterId === chapter.id
                  )?.isCompleted;
                  const isActive = selectedChapter === chapter.id;
                  const accessible = isChapterAccessible(chapter.id);

                  return (
                    <TouchableOpacity
                      key={chapter.id}
                      style={[
                        styles.chapterItem,
                        isActive && styles.chapterItemActive,
                        !accessible && styles.chapterItemDisabled,
                      ]}
                      onPress={() => accessible && setSelectedChapter(chapter.id)}
                      disabled={!accessible}
                    >
                      <View style={styles.chapterItemIcon}>
                        {isCompleted ? (
                          <CheckCircle size={16} color="#10b981" />
                        ) : accessible ? (
                          <PlayCircle size={16} color="#6b7280" />
                        ) : (
                          <Lock size={16} color="#6b7280" />
                        )}
                      </View>
                      <View style={styles.chapterItemContent}>
                        <Text style={styles.chapterItemTitle} numberOfLines={1}>
                          {chapter.title}
                        </Text>
                        {chapter.duration && (
                          <Text style={styles.chapterItemDuration}>
                            {formatTime(chapter.duration)}
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};
