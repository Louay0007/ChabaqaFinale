/**
 * Platform-specific DatePicker component
 * - Uses @react-native-community/datetimepicker on native platforms
 * - Uses HTML input type="date" on web
 */

import React from 'react';
import { Platform, View, TextInput, StyleSheet } from 'react-native';

let DateTimePicker: any = null;

// Only import DateTimePicker on native platforms
if (Platform.OS !== 'web') {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
}

interface DatePickerProps {
  value: Date;
  onChange: (event: any, selectedDate?: Date) => void;
  show: boolean;
  maximumDate?: Date;
  minimumDate?: Date;
}

const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  show,
  maximumDate,
  minimumDate,
}) => {
  if (Platform.OS === 'web') {
    // Web implementation using HTML input
    const handleWebChange = (e: any) => {
      const dateString = e.target.value;
      if (dateString) {
        const date = new Date(dateString);
        onChange({ type: 'set', nativeEvent: {} }, date);
      }
    };

    const formatDateForWeb = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const formatDateForDisplay = (date?: Date): string => {
      if (!date) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    if (!show) return null;

    return (
      <View style={webStyles.container}>
        <input
          type="date"
          value={formatDateForWeb(value)}
          onChange={handleWebChange}
          max={maximumDate ? formatDateForDisplay(maximumDate) : undefined}
          min={minimumDate ? formatDateForDisplay(minimumDate) : undefined}
          style={{
            padding: 12,
            fontSize: 16,
            border: '1px solid #E5E7EB',
            borderRadius: 8,
            width: '100%',
            backgroundColor: '#FFFFFF',
            color: '#1F2937',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        />
      </View>
    );
  }

  // Native implementation
  if (!show || !DateTimePicker) return null;

  return (
    <DateTimePicker
      testID="dateTimePicker"
      value={value}
      mode="date"
      display="default"
      onChange={onChange}
      maximumDate={maximumDate}
      minimumDate={minimumDate}
      accentColor="#8e78fb"
    />
  );
};

const webStyles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
});

export default DatePicker;
