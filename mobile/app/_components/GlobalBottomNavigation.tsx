import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { 
  Compass, 
  MessageSquare, 
  Bell, 
  User, 
  Plus 
} from 'lucide-react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../lib/design-tokens';

interface GlobalBottomNavigationProps {
  style?: any;
}

export default function GlobalBottomNavigation({ style }: GlobalBottomNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (route: string) => {
    if (route === 'communities') {
      return pathname === '/(communities)' || pathname.startsWith('/(communities)/');
    }
    return pathname.startsWith(`/(${route})`);
  };

  const tabs = [
    {
      key: 'communities',
      label: 'Discover',
      icon: Compass,
      onPress: () => router.push('/(communities)'),
    },
    {
      key: 'messages',
      label: 'Messages',
      icon: MessageSquare,
      onPress: () => router.push('/(messages)'),
    },
    {
      key: 'create',
      label: 'Create',
      icon: Plus,
      onPress: () => router.push('/(build_community)'),
      special: true,
    },
    {
      key: 'notifications',
      label: 'Alerts',
      icon: Bell,
      onPress: () => router.push('/(notifications)'),
    },
    {
      key: 'profile',
      label: 'Profile',
      icon: User,
      onPress: () => router.push('/(profile)'),
    },
  ];

  return (
    <View style={[styles.container, style]}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.key);
          
          if (tab.special) {
            // Special create button
            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.createButton}
                onPress={tab.onPress}
                activeOpacity={0.8}
              >
                <View style={styles.createButtonGradient}>
                  <Icon size={24} color={colors.white} />
                </View>
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              key={tab.key}
              style={styles.tabButton}
              onPress={tab.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, active && styles.activeIconContainer]}>
                <Icon 
                  size={20} 
                  color={active ? colors.primary : colors.gray500} 
                />
              </View>
              <Text style={[styles.tabLabel, active && styles.activeTabLabel]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = {
  container: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  tabBar: {
    flexDirection: 'row' as const,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.sm,
    shadowColor: colors.gray800,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    paddingVertical: spacing.xs,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginBottom: 2,
  },
  activeIconContainer: {
    backgroundColor: colors.primaryLight,
  },
  tabLabel: {
    fontSize: fontSize.xs,
    color: colors.gray500,
    fontWeight: fontWeight.medium as any,
  },
  activeTabLabel: {
    color: colors.primary,
    fontWeight: fontWeight.semibold as any,
  },
  createButton: {
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    marginHorizontal: spacing.sm,
  },
  createButtonGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
};
