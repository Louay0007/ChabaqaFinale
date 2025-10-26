import { useAuth } from '@/hooks/use-auth';
import { useAdaptiveColors } from '@/hooks/useAdaptiveColors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
}

interface MenuItem {
  id: string;
  title: string;
  icon?: string;
  logo?: string;
  onPress: () => void;
}

export default function Sidebar({ isVisible, onClose }: SidebarProps) {
  const { isAuthenticated, logout } = useAuth();
  const adaptiveColors = useAdaptiveColors();
  
  if (!isVisible) return null;

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      onClose();
      // Navigate to signin screen after logout
      router.replace('/(auth)/signin');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const menuItems: MenuItem[] = [
    // MAIN NAVIGATION SECTION
    {
      id: 'discover',
      title: 'Discover Communities',
      icon: 'compass',
      onPress: () => {
        router.push('/(communities)');
        onClose();
      }
    },
    {
      id: 'messages',
      title: 'Messages & DMs',
      icon: 'chatbubbles',
      onPress: () => {
        router.push('/(messages)');
        onClose();
      }
    },
    {
      id: 'notifications',
      title: 'Notifications',
      icon: 'notifications',
      onPress: () => {
        router.push('/(notifications)');
        onClose();
      }
    },
    // USER ACTIONS SECTION
    {
      id: 'profile',
      title: 'My Profile',
      icon: 'person-circle',
      onPress: () => {
        router.push('/(profile)');
        onClose();
      }
    },
    {
      id: 'create',
      title: 'Create Community',
      icon: 'add-circle',
      onPress: () => {
        router.push('/(build_community)');
        onClose();
      }
    },
    // MY COMMUNITIES SECTION (examples - these would be dynamically loaded)
    {
      id: 'digital-marketing',
      title: 'Digital Marketing Mastery',
      logo: 'https://via.placeholder.com/24x24/6366f1/ffffff?text=DM',
      onPress: () => {
        router.push('/(community)/digital-marketing-mastery/(loggedUser)/home');
        onClose();
      }
    },
    // ACCOUNT SECTION
    {
      id: 'logout',
      title: 'Logout',
      icon: 'log-out-outline',
      onPress: handleLogout
    }
  ];

  return (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      elevation: 1000,
      flexDirection: 'row',
    }}>
      {/* Sidebar Content */}
      <View style={{
        width: 280,
        backgroundColor: adaptiveColors.isDark ? '#1f2937' : '#ffffff',
        paddingTop: 60,
        paddingHorizontal: 16,
        paddingBottom: 24,
        elevation: 1001,
        zIndex: 10000,
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        borderRightWidth: 1,
        borderRightColor: adaptiveColors.isDark ? '#374151' : '#e5e7eb',
      }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header with Logo */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 24,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: adaptiveColors.isDark ? '#374151' : '#e5e7eb',
          }}>
            <Image
              source={require('@/assets/images/logo_chabaqa.png')}
              style={{ width: 80, height: 24, resizeMode: 'contain' }}
            />
          </View>

          {/* Menu Items with Sections */}
          {menuItems
            .filter((item) => {
              // Show profile and logout only when authenticated
              if ((item.id === 'profile' || item.id === 'logout') && !isAuthenticated) return false;
              return true;
            })
            .map((item, index) => (
            <React.Fragment key={item.id}>
              {/* Section Headers */}
              {item.id === 'profile' && (
                <Text style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: adaptiveColors.isDark ? '#9ca3af' : '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  marginTop: 20,
                  marginBottom: 8,
                  paddingHorizontal: 8,
                }}>
                  Your Account
                </Text>
              )}
              {item.id === 'digital-marketing' && (
                <Text style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: adaptiveColors.isDark ? '#9ca3af' : '#6b7280',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                  marginTop: 20,
                  marginBottom: 8,
                  paddingHorizontal: 8,
                }}>
                  My Communities
                </Text>
              )}
              
              {/* Separator before Logout item */}
              {item.id === 'logout' && (
                <View style={{
                  height: 1,
                  backgroundColor: adaptiveColors.isDark ? '#374151' : '#e5e7eb',
                  marginVertical: 12,
                }} />
              )}
              
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 8,
                  borderRadius: 8,
                  marginBottom: 4,
                  backgroundColor: item.id === 'discover' ? 
                    (adaptiveColors.isDark ? 'rgba(142, 120, 251, 0.1)' : 'rgba(142, 120, 251, 0.05)') : 'transparent',
                }}
                onPress={item.onPress}
              >
                <View style={{ marginRight: 12 }}>
                  {item.logo ? (
                    <Image
                      source={{ uri: item.logo }}
                      style={{ width: 20, height: 20, borderRadius: 4 }}
                    />
                  ) : (
                    <Ionicons 
                      name={item.icon as any} 
                      size={20} 
                      color={item.id === 'logout' 
                        ? '#ef4444' 
                        : item.id === 'discover'
                        ? '#8e78fb'
                        : (adaptiveColors.isDark ? '#9ca3af' : '#6b7280')
                      } 
                    />
                  )}
                </View>
                <Text style={{
                  fontSize: 16,
                  color: item.id === 'logout' 
                    ? '#ef4444' 
                    : item.id === 'discover'
                    ? '#8e78fb'
                    : (adaptiveColors.isDark ? '#ffffff' : '#1f2937'),
                  fontWeight: item.id === 'discover' ? '600' : '500',
                }}>
                  {item.title}
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </ScrollView>
      </View>
      
      {/* Background Overlay */}
      <TouchableOpacity 
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
        }}
        onPress={onClose}
        activeOpacity={1}
      />
    </View>
  );
}
