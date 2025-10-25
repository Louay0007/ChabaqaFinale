import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { CheckCircleIcon } from './Icons';

interface HeaderProps {
  isSuccess: boolean;
  email: string;
  styles: any;
}

const Header: React.FC<HeaderProps> = ({ isSuccess, email, styles }) => {
  return (
    <View style={styles.headerContainer}>
      {!isSuccess ? (
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
                  d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </LinearGradient>
          </View>
          <Text style={styles.headerTitle}>Reset your password</Text>
          <Text style={styles.headerSubtitle}>
            Enter the code sent to {email} and your new password.
          </Text>
          <Text style={styles.headerNote}>The code expires in 15 minutes.</Text>
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
              <CheckCircleIcon />
            </LinearGradient>
          </View>
          <Text style={styles.headerTitle}>Password reset successful!</Text>
          <Text style={styles.headerSubtitle}>Your password has been successfully updated.</Text>
          <Text style={styles.headerNote}>Click the button below to sign in with your new password.</Text>
        </>
      )}
    </View>
  );
};

export default Header;
