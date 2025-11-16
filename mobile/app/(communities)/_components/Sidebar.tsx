import { useAuth } from '@/hooks/use-auth';
import { useAdaptiveColors } from '@/hooks/useAdaptiveColors';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getMyJoinedCommunities } from '@/lib/communities-api';

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
  const { isAuthenticated } = useAuth();
  const adaptiveColors = useAdaptiveColors();
  const insets = useSafeAreaInsets();
  const [joinedCommunities, setJoinedCommunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Fetch joined communities when sidebar becomes visible
  useEffect(() => {
    if (isVisible && isAuthenticated) {
      fetchJoinedCommunities();
    }
  }, [isVisible, isAuthenticated]);

  const fetchJoinedCommunities = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching joined communities for sidebar...');
      
      const response = await getMyJoinedCommunities();
      if (response.success && response.data) {
        // Transform communities for sidebar display
        const transformedCommunities = response.data.map((community: any) => ({
          id: community._id || community.id,
          slug: community.slug,
          name: community.name,
          logo: community.logo || community.settings?.logo,
          category: community.category,
          members: community.membersCount || community.members,
        }));
        
        setJoinedCommunities(transformedCommunities);
        console.log('✅ Joined communities loaded:', transformedCommunities.length);
      }
    } catch (error) {
      console.error('❌ Error fetching joined communities:', error);
      // Don't show error in sidebar, just log it
    } finally {
      setLoading(false);
    }
  };
  
  if (!isVisible) return null;

  const menuItems: MenuItem[] = [
    {
      id: 'create',
      title: 'Create a community',
      icon: 'add-circle',
      onPress: () => {
        router.push('/(build_community)');
        onClose();
      }
    },
    {
      id: 'discover',
      title: 'Discover communities',
      icon: 'compass',
      onPress: () => {
        onClose();
      }
    }
  ];

  const generateCommunityLogo = (name: string, category?: string) => {
    const firstLetter = name.charAt(0).toUpperCase();
    const colors = {
      'Marketing': '#8e78fb',
      'Design': '#3b82f6',
      'Fitness': '#10b981',
      'Technology': '#f59e0b',
      'Development': '#ef4444',
      'Web Design': '#6366f1',
    };
    const color = colors[category as keyof typeof colors] || '#8e78fb';
    return `https://placehold.co/24x24/${color.slice(1)}/ffffff?text=${firstLetter}`;
  };

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
        paddingTop: Math.max(insets.top, 20),
        paddingBottom: Math.max(insets.bottom, 24),
        paddingHorizontal: 16,
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

          {/* Main Menu Items */}
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
                paddingHorizontal: 8,
                borderRadius: 8,
                marginBottom: 4,
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
                    color={adaptiveColors.isDark ? '#9ca3af' : '#6b7280'} 
                  />
                )}
              </View>
              <Text style={{
                fontSize: 16,
                color: adaptiveColors.isDark ? '#ffffff' : '#1f2937',
                fontWeight: '500',
              }}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}

          {/* Joined Communities Section */}
          {isAuthenticated && (
            <>
              <View style={{
                marginTop: 24,
                marginBottom: 16,
                paddingTop: 16,
                borderTopWidth: 1,
                borderTopColor: adaptiveColors.isDark ? '#374151' : '#e5e7eb',
              }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}>
                  <Text style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: adaptiveColors.isDark ? '#9ca3af' : '#6b7280',
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}>
                    My Communities
                  </Text>
                  {loading && (
                    <ActivityIndicator size="small" color={adaptiveColors.isDark ? '#9ca3af' : '#6b7280'} />
                  )}
                </View>
              </View>

              {/* Joined Communities List */}
              {joinedCommunities.length > 0 ? (
                joinedCommunities.map((community) => (
                  <TouchableOpacity
                    key={community.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 10,
                      paddingHorizontal: 8,
                      borderRadius: 8,
                      marginBottom: 2,
                      backgroundColor: 'transparent',
                    }}
                    onPress={() => {
                      // Navigate to logged user community home page
                      router.push(`/(community)/${community.slug}/(loggedUser)/home`);
                      onClose();
                    }}
                  >
                    <View style={{ marginRight: 12 }}>
                      <Image
                        source={{ 
                          uri: community.logo || generateCommunityLogo(community.name, community.category)
                        }}
                        style={{ 
                          width: 20, 
                          height: 20, 
                          borderRadius: 4,
                          backgroundColor: '#f3f4f6'
                        }}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text 
                        style={{
                          fontSize: 14,
                          color: adaptiveColors.isDark ? '#ffffff' : '#1f2937',
                          fontWeight: '500',
                        }}
                        numberOfLines={1}
                      >
                        {community.name}
                      </Text>
                      <Text 
                        style={{
                          fontSize: 12,
                          color: adaptiveColors.isDark ? '#9ca3af' : '#6b7280',
                          marginTop: 2,
                        }}
                        numberOfLines={1}
                      >
                        {community.members ? `${community.members} members` : community.category}
                      </Text>
                    </View>
                    <Ionicons 
                      name="chevron-forward" 
                      size={16} 
                      color={adaptiveColors.isDark ? '#6b7280' : '#9ca3af'} 
                    />
                  </TouchableOpacity>
                ))
              ) : (
                !loading && (
                  <View style={{
                    paddingVertical: 16,
                    paddingHorizontal: 8,
                    alignItems: 'center',
                  }}>
                    <Ionicons 
                      name="people-outline" 
                      size={24} 
                      color={adaptiveColors.isDark ? '#6b7280' : '#9ca3af'} 
                    />
                    <Text style={{
                      fontSize: 12,
                      color: adaptiveColors.isDark ? '#6b7280' : '#9ca3af',
                      textAlign: 'center',
                      marginTop: 8,
                    }}>
                      No communities joined yet.{"\n"}Discover some communities!
                    </Text>
                  </View>
                )
              )}
            </>
          )}
          {/* Refresh Button */}
          {isAuthenticated && (
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 6,
                marginTop: 12,
                backgroundColor: adaptiveColors.isDark ? '#374151' : '#f3f4f6',
              }}
              onPress={fetchJoinedCommunities}
              disabled={loading}
            >
              <Ionicons 
                name={loading ? 'hourglass' : 'refresh'} 
                size={14} 
                color={adaptiveColors.isDark ? '#9ca3af' : '#6b7280'} 
              />
              <Text style={{
                fontSize: 12,
                color: adaptiveColors.isDark ? '#9ca3af' : '#6b7280',
                marginLeft: 6,
                fontWeight: '500',
              }}>
                {loading ? 'Refreshing...' : 'Refresh'}
              </Text>
            </TouchableOpacity>
          )}
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
