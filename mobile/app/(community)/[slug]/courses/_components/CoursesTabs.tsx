import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';

interface CoursesTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  allCourses: any[];
  userEnrollments: any[];
}

export const CoursesTabs: React.FC<CoursesTabsProps> = ({
  activeTab,
  onTabChange,
  allCourses,
  userEnrollments,
}) => {
  const freeCourses = allCourses.filter(c => c.price === 0);
  const paidCourses = allCourses.filter(c => c.price > 0);

  return (
    <View style={styles.tabsContainer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.activeTab]}
          onPress={() => onTabChange('all')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'all' && styles.activeTabText,
            ]}
          >
            All ({allCourses.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'enrolled' && styles.activeTab]}
          onPress={() => onTabChange('enrolled')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'enrolled' && styles.activeTabText,
            ]}
          >
            Enrolled ({userEnrollments.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'free' && styles.activeTab]}
          onPress={() => onTabChange('free')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'free' && styles.activeTabText,
            ]}
          >
            Free ({freeCourses.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'paid' && styles.activeTab]}
          onPress={() => onTabChange('paid')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'paid' && styles.activeTabText,
            ]}
          >
            Paid ({paidCourses.length})
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
