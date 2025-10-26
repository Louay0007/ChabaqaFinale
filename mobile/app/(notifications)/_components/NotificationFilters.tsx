import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { 
  Bell, 
  BellOff, 
  Check 
} from 'lucide-react-native';

import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../../lib/design-tokens';

type FilterType = 'all' | 'unread' | 'read';

interface NotificationFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  unreadCount: number;
}

export default function NotificationFilters({ 
  activeFilter, 
  onFilterChange, 
  unreadCount 
}: NotificationFiltersProps) {
  
  const filters = [
    { 
      key: 'all' as FilterType, 
      label: 'All', 
      icon: Bell,
      count: undefined
    },
    { 
      key: 'unread' as FilterType, 
      label: 'Unread', 
      icon: BellOff,
      count: unreadCount > 0 ? unreadCount : undefined
    },
    { 
      key: 'read' as FilterType, 
      label: 'Read', 
      icon: Check,
      count: undefined
    },
  ];

  return (
    <View style={styles.container}>
      {filters.map(({ key, label, icon: Icon, count }) => (
        <TouchableOpacity
          key={key}
          style={[
            styles.filterTab,
            activeFilter === key && styles.activeFilterTab
          ]}
          onPress={() => onFilterChange(key)}
          activeOpacity={0.7}
        >
          <Icon 
            size={16} 
            color={activeFilter === key ? colors.white : 'rgba(255, 255, 255, 0.7)'} 
          />
          <Text 
            style={[
              styles.filterTabText,
              activeFilter === key && styles.activeFilterTabText
            ]}
          >
            {label}
          </Text>
          {count !== undefined && count > 0 && (
            <View style={styles.countBadge}>
              <Text style={styles.countBadgeText}>
                {count > 99 ? '99+' : count.toString()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = {
  container: {
    flexDirection: 'row' as const,
    justifyContent: 'space-around' as const,
  },
  filterTab: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    minWidth: 80,
    justifyContent: 'center' as const,
  },
  activeFilterTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterTabText: {
    marginLeft: spacing.xs,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium as any,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  activeFilterTabText: {
    color: colors.white,
    fontWeight: fontWeight.semibold as any,
  },
  countBadge: {
    marginLeft: spacing.xs,
    backgroundColor: '#ff4757',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 4,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  countBadgeText: {
    fontSize: fontSize.xs - 1,
    fontWeight: fontWeight.bold as any,
    color: colors.white,
  },
};
