import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';

interface TabItem {
  key: string;
  label: string;
  count?: number;
}

interface TabsNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: TabItem[];
}

export default function TabsNavigation({ activeTab, onTabChange, tabs }: TabsNavigationProps) {
  const renderTabButton = (tab: TabItem) => {
    const displayLabel = tab.count !== undefined ? `${tab.label} (${tab.count})` : tab.label;
    
    return (
      <TouchableOpacity
        key={tab.key}
        style={[
          styles.tab,
          activeTab === tab.key && styles.activeTab,
        ]}
        onPress={() => onTabChange(tab.key)}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === tab.key && styles.activeTabText,
          ]}
        >
          {displayLabel}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.tabsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tabs.map(renderTabButton)}
      </ScrollView>
    </View>
  );
}
