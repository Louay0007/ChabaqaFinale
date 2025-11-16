import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles';

export type TabType = 'content' | 'notes' | 'resources' | 'discussion';

interface TabsNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const TabsNavigation: React.FC<TabsNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <View style={styles.tabsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'content' && styles.activeTab]}
          onPress={() => onTabChange('content')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'content' && styles.activeTabText,
            ]}
          >
            Content
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'notes' && styles.activeTab]}
          onPress={() => onTabChange('notes')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'notes' && styles.activeTabText,
            ]}
          >
            Notes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'resources' && styles.activeTab]}
          onPress={() => onTabChange('resources')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'resources' && styles.activeTabText,
            ]}
          >
            Resources
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'discussion' && styles.activeTab]}
          onPress={() => onTabChange('discussion')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'discussion' && styles.activeTabText,
            ]}
          >
            Discussion
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
