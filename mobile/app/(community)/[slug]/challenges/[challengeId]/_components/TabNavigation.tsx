import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { key: 'overview', label: 'Overview' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'leaderboard', label: 'Leaderboard' },
  { key: 'submissions', label: 'My Work' },
];

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  const renderTabButton = (tabKey: string, label: string) => (
    <TouchableOpacity
      key={tabKey}
      style={[
        styles.tab,
        activeTab === tabKey && styles.activeTab,
      ]}
      onPress={() => onTabChange(tabKey)}
    >
      <Text
        style={[
          styles.tabText,
          activeTab === tabKey && styles.activeTabText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.tabsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tabs.map(({ key, label }) => renderTabButton(key, label))}
      </ScrollView>
    </View>
  );
}
