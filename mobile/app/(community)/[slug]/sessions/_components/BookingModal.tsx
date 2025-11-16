import { ChevronLeft, ChevronRight, X } from 'lucide-react-native';
import React from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';
import { SessionType } from './SessionCard';

interface BookingModalProps {
  visible: boolean;
  selectedSession: SessionType | null;
  currentDate: Date;
  selectedDate: Date | null;
  selectedTime: string;
  sessionNotes: string;
  onClose: () => void;
  onConfirm: () => void;
  onDateSelect: (date: Date) => void;
  onTimeSelect: (time: string) => void;
  onNotesChange: (notes: string) => void;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  visible,
  selectedSession,
  currentDate,
  selectedDate,
  selectedTime,
  sessionNotes,
  onClose,
  onConfirm,
  onDateSelect,
  onTimeSelect,
  onNotesChange,
  onPreviousMonth,
  onNextMonth,
}) => {
  const availableTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  const getMonthName = (date: Date) => {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months[date.getMonth()];
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getBookingCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity 
            onPress={() => {
              console.log('Close button pressed');
              onClose();
            }} 
            style={styles.closeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            activeOpacity={0.7}
          >
            <X size={20} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>
            Book {selectedSession?.title || 'Session'}
          </Text>
          <Text style={styles.modalSubtitle}>
            Schedule your session with {selectedSession?.mentor.name}
          </Text>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Select Date</Text>
            
            <View style={styles.modalCalendarView}>
              <View style={styles.modalCalendarHeader}>
                <TouchableOpacity onPress={onPreviousMonth} style={styles.monthNavButton}>
                  <ChevronLeft size={20} color="#6b7280" />
                </TouchableOpacity>
                <Text style={styles.modalCalendarMonthText}>
                  {getMonthName(currentDate)} {currentDate.getFullYear()}
                </Text>
                <TouchableOpacity onPress={onNextMonth} style={styles.monthNavButton}>
                  <ChevronRight size={20} color="#6b7280" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.modalWeekdayHeader}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, index) => (
                  <Text key={index} style={styles.modalWeekdayText}>{day}</Text>
                ))}
              </View>
              
              <View style={styles.modalCalendarGrid}>
                {getBookingCalendarDays().map((day, index) => (
                  <View key={index} style={styles.modalCalendarDay}>
                    {day && (
                      <TouchableOpacity 
                        style={[
                          styles.modalDayButton,
                          selectedDate?.getDate() === day && styles.selectedDayButton
                        ]}
                        onPress={() => onDateSelect(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                      >
                        <Text style={[
                          styles.modalCalendarDayText,
                          selectedDate?.getDate() === day && styles.selectedDayText
                        ]}>
                          {day}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Available Times</Text>
            <View style={styles.timeGrid}>
              {availableTimes.map((time) => (
                <TouchableOpacity
                  key={time}
                  style={[
                    styles.timeButton,
                    selectedTime === time && styles.selectedTimeButton
                  ]}
                  onPress={() => onTimeSelect(time)}
                >
                  <Text style={[
                    styles.timeButtonText,
                    selectedTime === time && styles.selectedTimeButtonText
                  ]}>
                    {time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Session Notes (Optional)</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="What would you like to focus on in this session?"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={4}
              value={sessionNotes}
              onChangeText={onNotesChange}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Session Summary</Text>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Duration:</Text>
              <Text style={styles.summaryValue}>{selectedSession?.duration} minutes</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Price:</Text>
              <Text style={styles.summaryValue}>${selectedSession?.price}</Text>
            </View>
            
            {selectedDate && selectedTime && (
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Scheduled:</Text>
                <Text style={styles.summaryValue}>
                  {selectedDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: '2-digit',
                    year: 'numeric'
                  })} at {selectedTime}
                </Text>
              </View>
            )}
          </View>

          <TouchableOpacity 
            style={[
              styles.confirmButton,
              (!selectedDate || !selectedTime) && styles.disabledButton
            ]}
            onPress={onConfirm}
            disabled={!selectedDate || !selectedTime}
          >
            <Text style={styles.confirmButtonText}>
              Confirm Booking - ${selectedSession?.price}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};
