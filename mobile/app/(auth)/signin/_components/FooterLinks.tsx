import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface FooterLinksProps {
  styles: any;
}

const FooterLinks: React.FC<FooterLinksProps> = ({ styles }) => {
  return (
    <View style={styles.linksContainer}>
      <TouchableOpacity onPress={() => router.navigate('../forgot-password')}>
        <Text style={styles.linkText}>Forgot your password?</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.navigate('../signup')}>
        <Text style={styles.signupText}>
          New to Chabaqa? <Text style={styles.linkText}>Create an account</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default FooterLinks;
