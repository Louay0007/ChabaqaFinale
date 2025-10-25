import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';

export type TabItem = {
  key: string;
  title: string;
};

interface SessionsTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabPress: (tabKey: string) => void;
  bookedSessionsCount: number;
  availableSessionsCount: number;
}

export const SessionsTabs: React.FC<SessionsTabsProps> = ({
  tabs,
  activeTab,
  onTabPress,
  bookedSessionsCount,
  availableSessionsCount,
}) => {
  const getTabTitle = (tab: TabItem) => {
    switch (tab.key) {
      case 'available':
        return `Available (${availableSessionsCount})`;
      case 'mysessions':
        return `My Sessions (${bookedSessionsCount})`;
      default:
        return tab.title;
    }
  };

  return (
    <View style={styles.tabsContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ flexDirection: 'row' }}
      >
        <TouchableOpacity
          style={[styles.tab, activeTab === 'available' && styles.activeTab]}
          onPress={() => onTabPress('available')}
        >
          <Text style={[styles.tabText, activeTab === 'available' && styles.activeTabText]}>
            Available ({availableSessionsCount})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'mysessions' && styles.activeTab]}
          onPress={() => onTabPress('mysessions')}
        >
          <Text style={[styles.tabText, activeTab === 'mysessions' && styles.activeTabText]}>
            My Sessions ({bookedSessionsCount})
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'calendar' && styles.activeTab]}
          onPress={() => onTabPress('calendar')}
        >
          <Text style={[styles.tabText, activeTab === 'calendar' && styles.activeTabText]}>
            Calendar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
