import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';
import { BookedSession } from './BookedSessionCard';
import { SessionType } from './SessionCard';

interface CalendarViewProps {
  currentDate: Date;
  bookedSessions: BookedSession[];
  sessionTypes: SessionType[];
  mentors: any[];
  onPreviousMonth: () => void;
  onNextMonth: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  bookedSessions,
  sessionTypes,
  mentors,
  onPreviousMonth,
  onNextMonth,
}) => {
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

  const isSessionDay = (day: number) => {
    return bookedSessions.some(session => {
      const sessionDate = new Date(session.scheduledAt);
      return sessionDate.getDate() === day &&
             sessionDate.getMonth() === currentDate.getMonth() &&
             sessionDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const generateCalendarDays = () => {
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
    <ScrollView 
      style={styles.calendarContainer} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.calendarContentContainer}
    >
      <View style={styles.calendarHeader}>
        <Text style={styles.calendarTitle}>Session Calendar</Text>
        <Text style={styles.calendarSubtitle}>View all your upcoming sessions</Text>
      </View>
      
      <View style={styles.calendarView}>
        <View style={styles.calendarMonthHeader}>
          <TouchableOpacity onPress={onPreviousMonth} style={styles.monthNavButton}>
            <ChevronLeft size={20} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.calendarMonthText}>
            {getMonthName(currentDate)} {currentDate.getFullYear()}
          </Text>
          <TouchableOpacity onPress={onNextMonth} style={styles.monthNavButton}>
            <ChevronRight size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.weekdayHeader}>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day, index) => (
            <Text key={index} style={styles.weekdayText}>{day}</Text>
          ))}
        </View>
        
        <View style={styles.calendarGrid}>
          {generateCalendarDays().map((day, index) => (
            <View key={index} style={styles.calendarDay}>
              {day && (
                <>
                  <TouchableOpacity 
                    style={[
                      styles.dayButton,
                      day === 3 && styles.currentDayButton,
                      isSessionDay(day) && styles.sessionDayButton
                    ]}
                  >
                    <Text style={[
                      styles.calendarDayText,
                      day === 3 && styles.currentDayText,
                      isSessionDay(day) && styles.sessionDayText
                    ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                  {isSessionDay(day) && <View style={styles.sessionIndicator} />}
                </>
              )}
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.upcomingSessionsSection}>
        <Text style={styles.upcomingSessionsTitle}>Upcoming Sessions</Text>
        
        {bookedSessions.map(session => {
          const sessionType = sessionTypes.find(s => s.id === session.sessionTypeId);
          const mentor = sessionType ? mentors.find(m => m.id === sessionType.mentor.id) : null;
          if (!sessionType || !mentor) return null;
          
          return (
            <View key={session.id} style={styles.upcomingSessionItem}>
              <Text style={styles.upcomingSessionTitle}>{sessionType.title}</Text>
              <Text style={styles.upcomingSessionDate}>
                {new Date(session.scheduledAt).toLocaleDateString('en-US', { 
                  month: 'short',
                  day: '2-digit'
                })}, {new Date(session.scheduledAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
              <Text style={styles.mentorText}>with {mentor.name}</Text>
            </View>
          );
        })}
      </View>
      
      <View style={styles.statsSection}>
        <Text style={styles.statsSectionTitle}>Quick Stats</Text>
        
        <View style={styles.statRow}>
          <Text style={styles.statRowLabel}>Sessions This Month</Text>
          <Text style={styles.statRowValue}>{bookedSessions.length}</Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={styles.statRowLabel}>Total Spent</Text>
          <Text style={styles.statRowValue}>
            ${bookedSessions.reduce((total, session) => {
              const sessionType = sessionTypes.find(s => s.id === session.sessionTypeId);
              return total + (sessionType?.price || 0);
            }, 0)}
          </Text>
        </View>
        
        <View style={[styles.statRow, styles.lastStatRow]}>
          <Text style={styles.statRowLabel}>Avg Rating Given</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.statRowValue}>4.8</Text>
            <Text style={styles.starIcon}>★</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};
