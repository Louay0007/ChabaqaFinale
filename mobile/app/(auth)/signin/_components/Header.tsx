import { useAdaptiveColors } from '@/hooks/useAdaptiveColors';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, Text, View } from 'react-native';
import { ShieldIcon } from './Icons';

interface HeaderProps {
  showTwoFactor: boolean;
  email: string;
  styles: any;
}

const Header: React.FC<HeaderProps> = ({ showTwoFactor, email, styles }) => {
  const colors = useAdaptiveColors();
  return (
    <>
      {!showTwoFactor && (
        <View style={styles.logoContainer}>
          <Image 
            source={require('@/assets/images/logo_chabaqa.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <LinearGradient
            colors={['#8e78fb', '#47c7ea']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoLine}
          />
        </View>
      )}
      
      <View style={styles.headerContainer}>
        {showTwoFactor ? (
          <>
            <View style={styles.shieldContainer}>
              <ShieldIcon styles={styles} />
            </View>
            <Text style={[styles.headerTitle, { color: colors.primaryText }]}>Check your email</Text>
            <Text style={[styles.headerSubtitle, { color: colors.secondaryText }]}>
              We've sent a verification code to {email}
            </Text>
            <Text style={[styles.headerNote, { color: colors.secondaryText }]}>The code will expire in 10 minutes.</Text>
          </>
        ) : (
          <>
            <Text style={[styles.welcomeTitle, { color: colors.primaryText }]}>Sign in to your Chabaqa space</Text>
            <Text style={[styles.welcomeSubtitle, { color: colors.secondaryText }]}>
              Create, educate and manage your digital communities
            </Text>
          </>
        )}
      </View>
    </>
  );
};

export default Header;
