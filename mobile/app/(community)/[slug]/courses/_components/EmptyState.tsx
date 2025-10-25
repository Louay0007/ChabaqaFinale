import { BookOpen } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../styles';

interface EmptyStateProps {
  searchQuery: string;
  activeTab?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  searchQuery, 
  activeTab 
}) => {
  return (
    <View style={styles.emptyState}>
      <BookOpen size={48} color="#d1d5db" />
      <Text style={styles.emptyStateTitle}>No courses found</Text>
      <Text style={styles.emptyStateText}>
        {searchQuery
          ? 'Try adjusting your search terms'
          : 'No courses match your current filter'}
      </Text>
    </View>
  );
};
