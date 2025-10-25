import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Image, Text, View } from 'react-native';

interface HeaderProps {
  styles: any;
}

const Header: React.FC<HeaderProps> = ({ styles }) => {
  return (
    <>
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
      
      <View style={styles.headerContainer}>
        <Text style={styles.welcomeTitle}>Create your Chabaqa space</Text>
        <Text style={styles.welcomeSubtitle}>
          Join the community and start building your digital presence
        </Text>
      </View>
    </>
  );
};

export default Header;
