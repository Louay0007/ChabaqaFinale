import React from 'react';
import { Text, View } from 'react-native';
import styles from '../styles';

const Stepper = ({ currentStep }: { currentStep: number }) => (
  <View style={styles.stepIndicator}>
    {[1, 2, 3].map(step => (
      <View key={step} style={styles.stepIndicatorContainer}>
        <View style={[styles.stepDot, currentStep >= step && styles.stepDotActive]}>
          <Text style={[styles.stepDotText, currentStep >= step && styles.stepDotTextActive]}>{step}</Text>
        </View>
        {step < 3 && <View style={[styles.stepLine, currentStep > step && styles.stepLineActive]} />}
      </View>
    ))}
  </View>
);

export default Stepper;