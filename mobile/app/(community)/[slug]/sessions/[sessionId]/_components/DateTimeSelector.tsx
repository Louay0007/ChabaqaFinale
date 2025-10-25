import { ThemedText } from '@/_components/ThemedText';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles';

export type DateTimeOption = {
  id: string;
  date: string;
  time: string;
  available: boolean;
};

interface DateTimeSelectorProps {
  dateOptions: DateTimeOption[];
  selectedDate: string | null;
  onSelectDate: (dateId: string) => void;
}

export const DateTimeSelector: React.FC<DateTimeSelectorProps> = ({
  dateOptions,
  selectedDate,
  onSelectDate,
}) => {
  return (
    <View style={styles.sectionContainer}>
      <ThemedText style={styles.sectionTitle}>Select a Date & Time</ThemedText>
      <View style={styles.dateTimeGrid}>
        {dateOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.dateTimeOption,
              selectedDate === option.id && styles.selectedDateTime,
              !option.available && styles.unavailableDateTime
            ]}
            onPress={() => option.available && onSelectDate(option.id)}
            disabled={!option.available}
          >
            <ThemedText
              style={[
                styles.dateText,
                selectedDate === option.id && styles.selectedDateTimeText,
                !option.available && styles.unavailableDateTimeText
              ]}
            >
              {option.date}
            </ThemedText>
            <ThemedText
              style={[
                styles.timeText,
                selectedDate === option.id && styles.selectedDateTimeText,
                !option.available && styles.unavailableDateTimeText
              ]}
            >
              {option.time}
            </ThemedText>
            {!option.available && (
              <ThemedText style={styles.unavailableText}>Booked</ThemedText>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
