import React from 'react';
import { View, Text } from 'react-native';
import styles from '../_styles';

const Footer: React.FC = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>© 2024 Chabaqa. Build the future of communities.</Text>
    </View>
  );
};

export default Footer;
