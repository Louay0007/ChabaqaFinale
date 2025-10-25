import { colors } from '@/lib/design-tokens';
import { useRouter } from 'expo-router';
import { ArrowLeft, BookOpen, Hash, Search, User } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Modal,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { modalStyles } from './modal-styles';

// Types pour la recherche
interface SearchResult {
  id: string;
  type: 'post' | 'user' | 'course' | 'tag';
  title: string;
  subtitle?: string;
  imageUrl?: string;
}

interface SearchModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SearchModal({ visible, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'React Native', 'JavaScript tutorial', 'Mobile development'
  ]);
  const router = useRouter();

  // Simuler une recherche
  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      setIsLoading(true);
      
      // Simule un délai de recherche
      const timer = setTimeout(() => {
        // Données de recherche simulées
        const mockResults: SearchResult[] = [
          {
            id: '1',
            type: 'user',
            title: 'John Doe',
            subtitle: 'Full Stack Developer',
            imageUrl: 'https://randomuser.me/api/portraits/men/32.jpg'
          },
          {
            id: '2',
            type: 'post',
            title: 'How to build a React Native app with Expo',
            subtitle: 'Posted by Jane Smith • 2 days ago'
          },
          {
            id: '3',
            type: 'course',
            title: 'React Native Masterclass',
            subtitle: '12 modules • 24 hours'
          },
          {
            id: '4',
            type: 'tag',
            title: 'react-native',
            subtitle: '245 posts'
          }
        ];

        // Filtrer les résultats basés sur la requête
        const filtered = mockResults.filter(
          result => result.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
        
        setResults(filtered);
        setIsLoading(false);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  // Gérer la sélection d'un résultat
  const handleResultPress = (result: SearchResult) => {
    // Ajouter à l'historique récent
    if (!recentSearches.includes(result.title)) {
      setRecentSearches(prev => [result.title, ...prev.slice(0, 4)]);
    }
    
    // Navigation basée sur le type
    switch (result.type) {
      case 'user':
        // Navigation vers le profil utilisateur
        console.log(`Navigate to user profile: ${result.id}`);
        break;
      case 'post':
        // Navigation vers le post
        console.log(`Navigate to post: ${result.id}`);
        break;
      case 'course':
        // Navigation vers le cours
        console.log(`Navigate to course: ${result.id}`);
        break;
      case 'tag':
        // Navigation vers la recherche de tag
        console.log(`Navigate to tag search: ${result.title}`);
        break;
    }
    
    onClose();
  };

  // Gérer la recherche récente
  const handleRecentSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Effacer l'historique de recherche
  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  // Rendu d'un élément de résultat
  const renderResultItem = ({ item }: { item: SearchResult }) => {
    // Sélectionner l'icône basée sur le type
    let IconComponent;
    switch (item.type) {
      case 'user':
        IconComponent = User;
        break;
      case 'course':
        IconComponent = BookOpen;
        break;
      case 'tag':
        IconComponent = Hash;
        break;
      default:
        IconComponent = Search;
    }

    return (
      <TouchableOpacity 
        style={modalStyles.searchResultItem} 
        onPress={() => handleResultPress(item)}
      >
        <View style={[modalStyles.searchResultIcon, 
          item.type === 'user' ? modalStyles.searchUserIcon : 
          item.type === 'course' ? modalStyles.searchCourseIcon : 
          item.type === 'tag' ? modalStyles.searchTagIcon : 
          modalStyles.searchPostIcon
        ]}>
          <IconComponent size={16} color="#fff" />
        </View>
        <View style={modalStyles.searchResultContent}>
          <Text style={modalStyles.searchResultTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={modalStyles.searchResultSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={modalStyles.searchContainer}>
        <View style={modalStyles.searchHeader}>
          <TouchableOpacity onPress={onClose} style={modalStyles.searchBackButton}>
            <ArrowLeft size={22} color={colors.gray700} />
          </TouchableOpacity>
          
          <View style={modalStyles.searchInputContainer}>
            <Search size={18} color={colors.gray500} style={modalStyles.searchIcon} />
            <TextInput
              style={modalStyles.searchInput}
              placeholder="Search posts, people, courses..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              returnKeyType="search"
              onSubmitEditing={Keyboard.dismiss}
            />
          </View>
        </View>

        {/* Résultats de recherche ou historique récent */}
        {searchQuery.trim().length > 0 ? (
          <View style={modalStyles.searchResultsContainer}>
            {isLoading ? (
              <Text style={modalStyles.searchStatusText}>Searching...</Text>
            ) : (
              results.length > 0 ? (
                <FlatList
                  data={results}
                  renderItem={renderResultItem}
                  keyExtractor={item => item.id}
                  style={modalStyles.searchResultsList}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <Text style={modalStyles.searchStatusText}>No results found</Text>
              )
            )}
          </View>
        ) : (
          <View style={modalStyles.searchRecentContainer}>
            <View style={modalStyles.searchRecentHeader}>
              <Text style={modalStyles.searchRecentTitle}>Recent Searches</Text>
              {recentSearches.length > 0 && (
                <TouchableOpacity onPress={clearRecentSearches}>
                  <Text style={modalStyles.searchClearText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>

            {recentSearches.length > 0 ? (
              recentSearches.map((query, index) => (
                <TouchableOpacity 
                  key={index}
                  style={modalStyles.searchRecentItem}
                  onPress={() => handleRecentSearch(query)}
                >
                  <Search size={16} color={colors.gray500} />
                  <Text style={modalStyles.searchRecentText}>{query}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={modalStyles.searchNoRecentText}>
                No recent searches
              </Text>
            )}
          </View>
        )}
      </SafeAreaView>
    </Modal>
  );
}
