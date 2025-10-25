import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import styles from '../_styles';

interface HeaderProps {
  isAuthenticated: boolean;
  user: any;
  onHowItWorksPress: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  isAuthenticated, 
  user, 
  onHowItWorksPress, 
  onLogout 
}) => {
  return (
    <View style={styles.header}>
      <Image 
        source={require('@/assets/images/logo_chabaqa.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <View style={styles.headerButtons}>
        <TouchableOpacity 
          style={styles.navButton}
          onPress={onHowItWorksPress}
        >
          <Text style={styles.navButtonText}>How it Works</Text>
        </TouchableOpacity>
        
        {/* Bouton de logout si l'utilisateur est connecté */}
        {isAuthenticated && user && (
          <TouchableOpacity 
            style={[styles.navButton, styles.logoutButton]}
            onPress={onLogout}
          >
            <Text style={[styles.navButtonText, styles.logoutButtonText]}>Logout</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Header;
