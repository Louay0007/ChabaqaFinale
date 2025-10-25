import { useAuth } from '@/hooks/use-auth';
import { getCurrentUser } from '@/lib/mock-data';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  BookOpen,
  Calendar,
  Home,
  LogOut,
  Package,
  Settings,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
  User,
  Users,
  X,
  Zap
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { modalStyles } from './modal-styles';

interface SideMenuModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SideMenuModal({ visible, onClose }: SideMenuModalProps) {
  const router = useRouter();
  const { logout } = useAuth();
  const params = useLocalSearchParams<{ slug: string }>();
  const slug = params.slug;
  const currentUser = getCurrentUser();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // Animation state
  const slideAnim = React.useRef(new Animated.Value(-300)).current;
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const screenWidth = Dimensions.get('window').width;
  const menuWidth = Math.min(300, screenWidth * 0.8);

  // Animation effect
  React.useEffect(() => {
    if (visible) {
      // Animation d'ouverture
      slideAnim.setValue(-menuWidth);
      fadeAnim.setValue(0);
      
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animation de fermeture
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: -menuWidth,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, fadeAnim, menuWidth]);

  const handleLogout = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Se déconnecter',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoggingOut(true);
              console.log('🚪 Début de la déconnexion...');
              
              // Appel de la fonction logout qui gère l'API et le nettoyage local
              await logout();
              
              console.log('✅ Déconnexion réussie');
              onClose(); // Fermer le menu
              
              // Rediriger vers la page de connexion
              router.replace('/(auth)/signin');
            } catch (error) {
              console.error('❌ Erreur lors de la déconnexion:', error);
              setIsLoggingOut(false);
              Alert.alert(
                'Erreur',
                'Une erreur est survenue lors de la déconnexion. Veuillez réessayer.'
              );
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      icon: <Home size={22} color="#4b5563" />, 
      label: 'Feed',
      onPress: () => {
        router.push(`/(community)/${slug}/(loggedUser)/home`);
        onClose();
      },
    },
    {
      icon: <Users size={22} color="#4b5563" />,
      label: 'Communities',
      onPress: () => {
        router.push('/(communities)');
        onClose();
      },
    },
    {
      icon: <BookOpen size={22} color="#3b82f6" />,
      label: 'Courses',
      onPress: () => {
        router.push(`/(community)/${slug}/courses`);
        onClose();
      },
    },
    {
      icon: <Zap size={22} color="#f97316" />,
      label: 'Challenge',
      onPress: () => {
        router.push(`/(community)/${slug}/challenges`);
        onClose();
      },
    },
    {
      icon: <Calendar size={22} color="#F7567C" />,
      label: 'Sessions',
      onPress: () => {
        router.push(`/(community)/${slug}/sessions`);
        onClose();
      },
    },
    {
      icon: <Package size={22} color="#6366f1" />,
      label: 'Products',
      onPress: () => {
        router.push(`/(community)/${slug}/products`);
        onClose();
      },
    },
    {
      icon: <Sparkles size={22} color="#9333ea" />,
      label: 'Events',
      onPress: () => {
        router.push(`/(community)/${slug}/events`);
        onClose();
      },
    },
    {
      icon: <TrendingUp size={22} color="#10b981" />,
      label: 'Progress',
      onPress: () => {
        router.push('/(tabs)/progress');
        onClose();
      },
    },
    {
      icon: <Trophy size={22} color="#f59e0b" />,
      label: 'Achievements',
      onPress: () => {
        router.push(`/(community)/${slug}/achievements`);
        onClose();
      },
    },
    {
      icon: <Star size={22} color="#4b5563" />,
      label: 'Saved',
      onPress: () => {
        router.push('/(tabs)/saved');
        onClose();
      },
    },
  ];

  const bottomItems = [
    {
      icon: <Settings size={22} color="#4b5563" />,
      label: 'Settings',
      onPress: () => {
        router.push('/settings');
        onClose();
      },
    },
    {
      icon: isLoggingOut ? (
        <ActivityIndicator size={22} color="#ef4444" />
      ) : (
        <LogOut size={22} color="#ef4444" />
      ),
      label: isLoggingOut ? 'Logging out...' : 'Log Out',
      onPress: handleLogout,
      disabled: isLoggingOut,
    },
  ];

  const renderSideMenuContent = () => (
    <SafeAreaView style={modalStyles.sideMenuContainer}>
      <ScrollView style={modalStyles.sideMenuScrollView}>
        {/* Profil de l'utilisateur */}
        <TouchableOpacity 
          style={modalStyles.profileSection}
          onPress={() => {
            router.push('/profile');
            onClose();
          }}
        >
          <View style={modalStyles.profileInfo}>
            {currentUser?.avatar ? (
              <Image
                source={{ uri: currentUser.avatar }}
                style={modalStyles.avatar}
              />
            ) : (
              <View style={modalStyles.avatarPlaceholder}>
                <User size={24} color="#6b7280" />
              </View>
            )}
            <View style={modalStyles.nameContainer}>
              <Text style={modalStyles.userName}>{currentUser?.name || 'User'}</Text>
              <Text style={modalStyles.userRole}>{currentUser?.role || 'Member'}</Text>
            </View>
          </View>
          <View style={modalStyles.profileArrow}>
            <Text style={modalStyles.viewProfile}>View Profile</Text>
          </View>
        </TouchableOpacity>

        {/* Ligne de séparation */}
        <View style={modalStyles.sideMenuDivider} />

        {/* Options principales du menu */}
        <View style={modalStyles.sideMenuItems}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={modalStyles.sideMenuItem}
              onPress={item.onPress}
            >
              <View style={modalStyles.sideMenuIcon}>{item.icon}</View>
              <Text style={modalStyles.sideMenuLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Ligne de séparation */}
        <View style={modalStyles.sideMenuDivider} />

        {/* Options du bas du menu */}
        <View style={modalStyles.bottomItems}>
          {bottomItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                modalStyles.sideMenuItem,
                item.disabled && modalStyles.disabledMenuItem
              ]}
              onPress={item.onPress}
              disabled={item.disabled}
            >
              <View style={modalStyles.sideMenuIcon}>{item.icon}</View>
              <Text style={[
                modalStyles.sideMenuLabel,
                item.label === 'Log Out' && modalStyles.logoutText,
                item.disabled && modalStyles.disabledText
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Version de l'app */}
        <Text style={modalStyles.versionText}>Chabaqa v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={modalStyles.sideMenuModalContainer}>
        {/* Fond semi-transparent */}
        <Animated.View 
          style={[
            modalStyles.sideMenuOverlay,
            {
              opacity: fadeAnim,
            },
          ]}
          onTouchEnd={onClose}
        />
        
        {/* Menu latéral avec animation */}
        <Animated.View 
          style={[
            modalStyles.sideMenuModalContent,
            {
              width: menuWidth,
              transform: [{ translateX: slideAnim }],
            },
          ]}
        >
          {/* Bouton de fermeture */}
          <TouchableOpacity 
            style={modalStyles.sideMenuCloseButton} 
            onPress={onClose}
          >
            <X size={24} color="#6b7280" />
          </TouchableOpacity>
          
          {/* Contenu du menu */}
          {renderSideMenuContent()}
        </Animated.View>
      </View>
    </Modal>
  );
}
