import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';

interface Tab {
  key: string;
  title: string;
  count: number;
}

interface ProductsTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  tabs: Tab[];
}

export const ProductsTabs: React.FC<ProductsTabsProps> = ({
  activeTab,
  onTabChange,
  tabs,
}) => {
  return (
    <View style={styles.tabsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => onTabChange(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.activeTabText]}>
              {tab.title} ({tab.count})
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
