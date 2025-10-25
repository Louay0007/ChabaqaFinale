import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import MailIcon from './MailIcon';

interface HeaderProps {
  isSubmitted: boolean;
  email: string;
  styles: any;
}

const Header: React.FC<HeaderProps> = ({ isSubmitted, email, styles }) => {
  return (
    <View style={styles.headerContainer}>
      {!isSubmitted ? (
        <>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#8e78fb', '#47c7ea']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.iconBackground}
            >
              <Svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <Path
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </LinearGradient>
          </View>
          <Text style={styles.welcomeTitle}>Forgot your password?</Text>
          <Text style={styles.welcomeSubtitle}>
            No worries! Enter your email address and we'll send you a verification code.
          </Text>
        </>
      ) : (
        <>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={['#8e78fb', '#47c7ea']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.iconBackground}
            >
              <MailIcon />
            </LinearGradient>
          </View>
          <Text style={styles.headerTitle}>Check your email</Text>
          <Text style={styles.headerSubtitle}>
            We've sent a 6-digit verification code to {email}
          </Text>
          <Text style={styles.headerNote}>The code will expire in 15 minutes.</Text>
        </>
      )}
    </View>
  );
};

export default Header;
