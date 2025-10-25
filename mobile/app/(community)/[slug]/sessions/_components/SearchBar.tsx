import { Search } from 'lucide-react-native';
import React from 'react';
import { TextInput, View } from 'react-native';
import { styles } from '../styles';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <Search size={16} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search sessions..."
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholderTextColor="#9ca3af"
        />
      </View>
    </View>
  );
};
