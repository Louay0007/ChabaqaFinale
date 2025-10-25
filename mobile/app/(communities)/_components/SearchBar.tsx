import { useAdaptiveColors } from '@/hooks/useAdaptiveColors';
import { Ionicons } from '@expo/vector-icons';
import { BookOpen, Calendar, Home, Package, Sparkles, Zap } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { communityStyles } from '../_styles';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedSort: string;
  onSortChange: (sort: string) => void;
  categories: string[];
  sortOptions: { value: string; label: string }[];
}

// Icônes et couleurs pour les catégories selon votre navigation bottom
const categoryConfig: { [key: string]: { icon: any; color: string } } = {
  "All": { icon: "apps", color: "#8e78fb" },
  "Community": { icon: Home, color: "#8e78fb" },
  "Course": { icon: BookOpen, color: "#3b82f6" },
  "Challenge": { icon: Zap, color: "#f97316" },
  "Product": { icon: Package, color: "#6366f1" },
  "1-to-1 Sessions": { icon: Calendar, color: "#F7567C" },
  "Event": { icon: Sparkles, color: "#9333ea" }
};

export default function SearchBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
}: SearchBarProps) {
  const adaptiveColors = useAdaptiveColors();
  
  return (
    <View style={[communityStyles.searchContainer, { backgroundColor: adaptiveColors.cardBackground }]}>
      {/* Search Input */}
      <View style={[communityStyles.searchBar, { backgroundColor: adaptiveColors.inputBackground, borderColor: adaptiveColors.inputBorder }]}>
        <Ionicons 
          name="search" 
          size={20} 
          color={adaptiveColors.secondaryText} 
          style={communityStyles.searchIcon}
        />
        <TextInput
          style={[communityStyles.searchInput, { color: adaptiveColors.primaryText }]}
          placeholder="Search for anything"
          value={searchQuery}
          onChangeText={onSearchChange}
          placeholderTextColor={adaptiveColors.secondaryText}
        />
      </View>

      {/* Category Pills */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        <View style={communityStyles.categoryContainer}>
          {categories.map((category) => {
            const config = categoryConfig[category];
            const isSelected = selectedCategory === category;
            const IconComponent = config?.icon;
            
            return (
              <TouchableOpacity
                key={category}
                style={[
                  communityStyles.categoryPill,
                  { backgroundColor: adaptiveColors.inputBackground, borderColor: adaptiveColors.inputBorder },
                  isSelected && [
                    communityStyles.categoryPillActive,
                    { backgroundColor: config?.color || '#8e78fb' }
                  ]
                ]}
                onPress={() => onCategoryChange(category)}
              >
                {category === "All" ? (
                  <Ionicons 
                    name="apps" 
                    size={18} 
                    color={isSelected ? '#ffffff' : (config?.color || '#64748b')}
                    style={{ marginRight: 6 }}
                  />
                ) : IconComponent ? (
                  <IconComponent 
                    size={18} 
                    color={isSelected ? '#ffffff' : (config?.color || '#64748b')}
                    style={{ marginRight: 6 }}
                  />
                ) : (
                  <Ionicons 
                    name="folder" 
                    size={18} 
                    color={isSelected ? '#ffffff' : '#64748b'}
                    style={{ marginRight: 6 }}
                  />
                )}
                <Text style={[
                  communityStyles.categoryPillText,
                  { color: adaptiveColors.primaryText },
                  isSelected && [
                    communityStyles.categoryPillTextActive,
                    { color: '#ffffff' }
                  ]
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
