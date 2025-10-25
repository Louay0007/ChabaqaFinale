import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface SuccessViewProps {
  onGoToReset: () => void;
  onTryDifferentEmail: () => void;
  styles: any;
}

const SuccessView: React.FC<SuccessViewProps> = ({
  onGoToReset,
  onTryDifferentEmail,
  styles
}) => {
  return (
    <View style={styles.form}>
      <View style={styles.successMessage}>
        <Text style={styles.successText}>
          Didn't receive the code? Check your spam folder or try again.
        </Text>
      </View>

      <TouchableOpacity
        onPress={onGoToReset}
        activeOpacity={1}
      >
        <LinearGradient
          colors={['#8e78fb', '#47c7ea']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Enter Verification Code</Text>
        </LinearGradient>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={onTryDifferentEmail}
      >
        <Text style={styles.secondaryButtonText}>Try Different Email</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SuccessView;
