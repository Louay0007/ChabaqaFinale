import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SuccessViewProps {
  onGoToSignIn: () => void;
  styles: any;
}

const SuccessView: React.FC<SuccessViewProps> = ({
  onGoToSignIn,
  styles
}) => {
  return (
    <View style={styles.form}>
      <View style={styles.successMessage}>
        <Text style={styles.successText}>
          You can now sign in with your new password.
        </Text>
      </View>

      <TouchableOpacity
        onPress={onGoToSignIn}
        activeOpacity={1}
      >
        <LinearGradient
          colors={['#8e78fb', '#47c7ea']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Go to Sign In</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default SuccessView;
