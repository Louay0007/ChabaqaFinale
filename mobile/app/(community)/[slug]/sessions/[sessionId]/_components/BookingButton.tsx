import { ThemedText } from '@/_components/ThemedText';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles';

interface BookingButtonProps {
  onBook: () => void;
  disabled: boolean;
}

export const BookingButton: React.FC<BookingButtonProps> = ({ onBook, disabled }) => {
  return (
    <View style={styles.bookingContainer}>
      <TouchableOpacity
        style={[styles.bookButton, disabled && styles.disabledButton]}
        onPress={onBook}
        disabled={disabled}
      >
        <ThemedText style={styles.bookButtonText}>
          Book Session
        </ThemedText>
      </TouchableOpacity>
    </View>
  );
};
