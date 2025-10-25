import { ShoppingBag } from 'lucide-react-native';
import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../styles';

interface EmptyStateProps {
  searchQuery?: string;
  title?: string;
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  searchQuery,
  title,
  message,
}) => {
  const getTitle = () => {
    if (title) return title;
    return 'No products found';
  };

  const getMessage = () => {
    if (message) return message;
    if (searchQuery) return 'Try adjusting your search terms';
    return 'No products match your current filter';
  };

  return (
    <View style={styles.emptyState}>
      <ShoppingBag size={48} color="#d1d5db" />
      <Text style={styles.emptyStateTitle}>{getTitle()}</Text>
      <Text style={styles.emptyStateText}>{getMessage()}</Text>
    </View>
  );
};
