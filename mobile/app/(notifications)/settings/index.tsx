import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Bell, 
  Mail, 
  Smartphone, 
  MessageSquare,
  Calendar,
  BookOpen,
  Users,
  Clock,
  ShoppingBag,
  Award,
  Settings as SettingsIcon,
  Moon,
  Volume2,
  VolumeX
} from 'lucide-react-native';

import { ThemedView } from '../../../_components/ThemedView';
import { useAuth } from '../../../hooks/use-auth';
import {
  NotificationPreferences,
  ChannelPreferences,
  QuietHours,
  getNotificationPreferences,
  updateNotificationPreferences,
} from '../../../lib/notification-api';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../../lib/design-tokens';

interface PreferenceItem {
  key: string;
  label: string;
  description: string;
  icon: React.ComponentType<any>;
}

const notificationTypes: PreferenceItem[] = [
  {
    key: 'messages',
    label: 'Messages',
    description: 'New direct messages and conversations',
    icon: MessageSquare,
  },
  {
    key: 'courses',
    label: 'Courses',
    description: 'Course updates and new content',
    icon: BookOpen,
  },
  {
    key: 'events',
    label: 'Events',
    description: 'Event reminders and announcements',
    icon: Calendar,
  },
  {
    key: 'sessions',
    label: 'Sessions',
    description: 'Session bookings and reminders',
    icon: Clock,
  },
  {
    key: 'communities',
    label: 'Communities',
    description: 'Community activities and invites',
    icon: Users,
  },
  {
    key: 'products',
    label: 'Products',
    description: 'Purchase confirmations and updates',
    icon: ShoppingBag,
  },
  {
    key: 'achievements',
    label: 'Achievements',
    description: 'Progress milestones and rewards',
    icon: Award,
  },
  {
    key: 'system',
    label: 'System',
    description: 'App updates and important notices',
    icon: SettingsIcon,
  },
];

export default function NotificationSettingsScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // State management
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [quietHours, setQuietHours] = useState<QuietHours>({
    start: '22:00',
    end: '08:00',
    isEnabled: false,
  });

  // Load preferences on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadPreferences();
    }
  }, [isAuthenticated]);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      console.log('⚙️ [NOTIFICATION-SETTINGS] Loading preferences');

      const prefs = await getNotificationPreferences();
      setPreferences(prefs);
      setQuietHours(prefs.quietHours || {
        start: '22:00',
        end: '08:00',
        isEnabled: false,
      });

      console.log('✅ [NOTIFICATION-SETTINGS] Preferences loaded');
    } catch (error: any) {
      console.error('💥 [NOTIFICATION-SETTINGS] Error loading preferences:', error);
      Alert.alert('Error', 'Failed to load notification preferences');
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async (updatedPrefs: Partial<NotificationPreferences>) => {
    try {
      setSaving(true);
      console.log('💾 [NOTIFICATION-SETTINGS] Saving preferences');

      const savedPrefs = await updateNotificationPreferences(updatedPrefs);
      setPreferences(savedPrefs);

      console.log('✅ [NOTIFICATION-SETTINGS] Preferences saved');
    } catch (error: any) {
      console.error('💥 [NOTIFICATION-SETTINGS] Error saving preferences:', error);
      Alert.alert('Error', 'Failed to save notification preferences');
    } finally {
      setSaving(false);
    }
  };

  const handleChannelToggle = (notificationType: string, channel: keyof ChannelPreferences, value: boolean) => {
    if (!preferences) return;

    const updatedPreferences = new Map(preferences.preferences);
    const currentPrefs = updatedPreferences.get(notificationType) || {
      inApp: true,
      email: true,
      push: true,
      sms: false,
    };

    updatedPreferences.set(notificationType, {
      ...currentPrefs,
      [channel]: value,
    });

    savePreferences({ preferences: updatedPreferences });
  };

  const handleQuietHoursToggle = (value: boolean) => {
    const updatedQuietHours = { ...quietHours, isEnabled: value };
    setQuietHours(updatedQuietHours);
    savePreferences({ quietHours: updatedQuietHours });
  };

  const getChannelPreferences = (notificationType: string): ChannelPreferences => {
    if (!preferences?.preferences) {
      return { inApp: true, email: true, push: true, sms: false };
    }
    
    return preferences.preferences.get(notificationType) || {
      inApp: true,
      email: true,
      push: true,
      sms: false,
    };
  };

  // Render header
  const renderHeader = () => (
    <View style={styles.header}>
      <ImageBackground
        source={require('../../../assets/images/background.png')}
        style={styles.headerBackground}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(142, 120, 251, 0.9)', 'rgba(142, 120, 251, 0.7)']}
          style={styles.headerOverlay}
        >
          <SafeAreaView style={styles.headerContent}>
            <BlurView intensity={20} style={styles.headerBlur}>
              <View style={styles.headerTop}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => router.back()}
                >
                  <ArrowLeft size={24} color={colors.white} />
                </TouchableOpacity>
                
                <Text style={styles.headerTitle}>Notification Settings</Text>
                
                <View style={styles.headerSpacer} />
              </View>
            </BlurView>
          </SafeAreaView>
        </LinearGradient>
      </ImageBackground>
    </View>
  );

  // Render notification type settings
  const renderNotificationTypeSettings = (item: PreferenceItem) => {
    const channelPrefs = getChannelPreferences(item.key);
    const IconComponent = item.icon;

    return (
      <View key={item.key} style={styles.settingsSection}>
        <BlurView intensity={90} style={styles.settingsCard}>
          {/* Header */}
          <View style={styles.settingsHeader}>
            <View style={styles.settingsIconContainer}>
              <LinearGradient
                colors={[colors.primary, '#9c88ff']}
                style={styles.settingsIcon}
              >
                <IconComponent size={20} color={colors.white} />
              </LinearGradient>
            </View>
            <View style={styles.settingsInfo}>
              <Text style={styles.settingsTitle}>{item.label}</Text>
              <Text style={styles.settingsDescription}>{item.description}</Text>
            </View>
          </View>

          {/* Channel Toggles */}
          <View style={styles.channelToggles}>
            {/* In-App Notifications */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Bell size={16} color={colors.gray600} />
                <Text style={styles.toggleLabel}>In-App</Text>
              </View>
              <Switch
                value={channelPrefs.inApp}
                onValueChange={(value) => handleChannelToggle(item.key, 'inApp', value)}
                trackColor={{ false: colors.gray300, true: colors.primaryLight }}
                thumbColor={channelPrefs.inApp ? colors.primary : colors.white}
                disabled={saving}
              />
            </View>

            {/* Email Notifications */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Mail size={16} color={colors.gray600} />
                <Text style={styles.toggleLabel}>Email</Text>
              </View>
              <Switch
                value={channelPrefs.email}
                onValueChange={(value) => handleChannelToggle(item.key, 'email', value)}
                trackColor={{ false: colors.gray300, true: colors.primaryLight }}
                thumbColor={channelPrefs.email ? colors.primary : colors.white}
                disabled={saving}
              />
            </View>

            {/* Push Notifications */}
            <View style={styles.toggleRow}>
              <View style={styles.toggleInfo}>
                <Smartphone size={16} color={colors.gray600} />
                <Text style={styles.toggleLabel}>Push</Text>
              </View>
              <Switch
                value={channelPrefs.push || false}
                onValueChange={(value) => handleChannelToggle(item.key, 'push', value)}
                trackColor={{ false: colors.gray300, true: colors.primaryLight }}
                thumbColor={channelPrefs.push ? colors.primary : colors.white}
                disabled={saving}
              />
            </View>
          </View>
        </BlurView>
      </View>
    );
  };

  // Render quiet hours settings
  const renderQuietHoursSettings = () => (
    <View style={styles.settingsSection}>
      <BlurView intensity={90} style={styles.settingsCard}>
        <View style={styles.settingsHeader}>
          <View style={styles.settingsIconContainer}>
            <LinearGradient
              colors={['#6366f1', '#8b5cf6']}
              style={styles.settingsIcon}
            >
              <Moon size={20} color={colors.white} />
            </LinearGradient>
          </View>
          <View style={styles.settingsInfo}>
            <Text style={styles.settingsTitle}>Quiet Hours</Text>
            <Text style={styles.settingsDescription}>
              Silence notifications during these hours ({quietHours.start} - {quietHours.end})
            </Text>
          </View>
          <Switch
            value={quietHours.isEnabled}
            onValueChange={handleQuietHoursToggle}
            trackColor={{ false: colors.gray300, true: colors.primaryLight }}
            thumbColor={quietHours.isEnabled ? colors.primary : colors.white}
            disabled={saving}
          />
        </View>
      </BlurView>
    </View>
  );

  // Loading state
  if (loading) {
    return (
      <ThemedView style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading notification settings...</Text>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {renderHeader()}

        {/* Settings Content */}
        <View style={styles.content}>
          {/* Notification Types */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Notification Types</Text>
            <Text style={styles.sectionSubtitle}>
              Choose how you want to receive notifications for different types of activities
            </Text>
          </View>

          {notificationTypes.map(renderNotificationTypeSettings)}

          {/* Quiet Hours */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Schedule</Text>
            <Text style={styles.sectionSubtitle}>
              Control when you receive notifications
            </Text>
          </View>

          {renderQuietHoursSettings()}
        </View>

        {/* Saving Indicator */}
        {saving && (
          <View style={styles.savingIndicator}>
            <BlurView intensity={90} style={styles.savingContent}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={styles.savingText}>Saving preferences...</Text>
            </BlurView>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  scrollContainer: {
    paddingBottom: spacing.xxxl,
  },

  // Header
  header: {
    marginBottom: spacing.lg,
  },
  headerBackground: {
    height: 160,
  },
  headerOverlay: {
    flex: 1,
  },
  headerContent: {
    flex: 1,
  },
  headerBlur: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
    justifyContent: 'flex-end' as const,
  },
  headerTop: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as any,
    color: colors.white,
  },
  headerSpacer: {
    width: 40,
  },

  // Content
  content: {
    paddingHorizontal: spacing.lg,
  },
  sectionHeader: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold as any,
    color: colors.gray800,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: fontSize.sm,
    color: colors.gray600,
    lineHeight: 18,
  },

  // Settings Sections
  settingsSection: {
    marginBottom: spacing.lg,
  },
  settingsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  // Settings Header
  settingsHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    marginBottom: spacing.md,
  },
  settingsIconContainer: {
    marginRight: spacing.md,
  },
  settingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  settingsInfo: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold as any,
    color: colors.gray800,
    marginBottom: 2,
  },
  settingsDescription: {
    fontSize: fontSize.sm,
    color: colors.gray600,
  },

  // Channel Toggles
  channelToggles: {
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    paddingTop: spacing.md,
  },
  toggleRow: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: spacing.sm,
  },
  toggleInfo: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  toggleLabel: {
    marginLeft: spacing.sm,
    fontSize: fontSize.base,
    color: colors.gray700,
  },

  // Loading & Saving
  loadingContainer: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    paddingTop: spacing.xxxl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.base,
    color: colors.gray600,
  },
  savingIndicator: {
    position: 'absolute' as const,
    top: 120,
    left: spacing.lg,
    right: spacing.lg,
  },
  savingContent: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  savingText: {
    marginLeft: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.gray600,
  },
};
