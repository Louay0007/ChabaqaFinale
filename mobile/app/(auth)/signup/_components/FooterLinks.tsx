import { router } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

interface FooterLinksProps {
  styles: any;
}

const FooterLinks: React.FC<FooterLinksProps> = ({ styles }) => {
  return (
    <View style={styles.linksContainer}>
      <Text style={styles.signinText}>
        Already have an account?{' '}
        <Text 
          style={styles.linkText}
          onPress={() => router.push('/(auth)/signin')}
        >
          Sign in
        </Text>
      </Text>
    </View>
  );
};

export default FooterLinks;
