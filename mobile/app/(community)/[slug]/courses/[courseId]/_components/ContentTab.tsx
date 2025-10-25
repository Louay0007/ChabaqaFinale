import { CheckCircle } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../../styles';

interface ContentTabProps {
  currentChapter: any;
  currentChapterIndex: number;
  allChapters: any[];
}

export const ContentTab: React.FC<ContentTabProps> = ({ 
  currentChapter, 
  currentChapterIndex, 
  allChapters 
}) => {
  return (
    <View style={styles.tabContent}>
      <View style={styles.chapterCard}>
        <View style={styles.chapterHeader}>
          <Text style={styles.chapterTitle}>{currentChapter?.title}</Text>
          <Text style={styles.chapterNumber}>
            Chapter {currentChapterIndex + 1} of {allChapters.length}
          </Text>
        </View>
        <Text style={styles.chapterContent}>{currentChapter?.content}</Text>

        <Text style={styles.sectionTitle}>Key Learning Points</Text>
        <View style={styles.learningPoints}>
          <View style={styles.learningPoint}>
            <CheckCircle size={16} color="#10b981" />
            <Text style={styles.learningPointText}>
              Understanding React component lifecycle
            </Text>
          </View>
          <View style={styles.learningPoint}>
            <CheckCircle size={16} color="#10b981" />
            <Text style={styles.learningPointText}>
              Managing component state effectively
            </Text>
          </View>
          <View style={styles.learningPoint}>
            <CheckCircle size={16} color="#10b981" />
            <Text style={styles.learningPointText}>
              Handling user interactions and events
            </Text>
          </View>
          <View style={styles.learningPoint}>
            <CheckCircle size={16} color="#10b981" />
            <Text style={styles.learningPointText}>
              Best practices for component composition
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Practice Exercise</Text>
        <Text style={styles.exerciseText}>
          Create a simple counter component that demonstrates the concepts covered in this
          chapter. The component should include increment, decrement, and reset
          functionality.
        </Text>
      </View>
    </View>
  );
};
