import { Event, EventRegistration } from '@/lib/mock-data';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CalendarTabProps {
  myTickets: EventRegistration[];
  availableEvents: Event[];
}

export default function CalendarTab({ myTickets, availableEvents }: CalendarTabProps) {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  };

  const totalSpent = myTickets.reduce((acc, ticket) => acc + ticket.totalAmount, 0);

  // Calendar functions - même logique que sessions
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

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const isEventDay = (day: number) => {
    return myTickets.some(ticket => {
      const eventDate = new Date(ticket.event.startDate);
      return eventDate.getDate() === day &&
             eventDate.getMonth() === currentDate.getMonth() &&
             eventDate.getFullYear() === currentDate.getFullYear();
    });
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() &&
           currentDate.getMonth() === today.getMonth() &&
           currentDate.getFullYear() === today.getFullYear();
  };

  return (
    <ScrollView 
      style={styles.calendarContainer} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.calendarContentContainer}
    >
      <View style={styles.calendarHeader}>
        <Text style={styles.calendarTitle}>Event Calendar</Text>
        <Text style={styles.calendarSubtitle}>View all your upcoming events</Text>
      </View>
      
      {/* Calendar */}
      <View style={styles.calendarView}>
        <View style={styles.calendarMonthHeader}>
          <TouchableOpacity onPress={previousMonth} style={styles.monthNavButton}>
            <ChevronLeft size={20} color="#6b7280" />
          </TouchableOpacity>
          <Text style={styles.calendarMonthText}>
            {getMonthName(currentDate)} {currentDate.getFullYear()}
          </Text>
          <TouchableOpacity onPress={nextMonth} style={styles.monthNavButton}>
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
                      isToday(day) && styles.currentDayButton,
                      isEventDay(day) && styles.eventDayButton
                    ]}
                  >
                    <Text style={[
                      styles.calendarDayText,
                      isToday(day) && styles.currentDayText,
                      isEventDay(day) && styles.eventDayText
                    ]}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                  {isEventDay(day) && <View style={styles.eventIndicator} />}
                </>
              )}
            </View>
          ))}
        </View>
      </View>
      
      <View style={styles.upcomingEventsSection}>
        <Text style={styles.upcomingEventsTitle}>Upcoming Events</Text>
        
        {myTickets.map(ticket => {
          return (
            <View key={ticket.id} style={styles.upcomingEventItem}>
              <Text style={styles.upcomingEventTitle}>{ticket.event.title}</Text>
              <Text style={styles.upcomingEventDate}>
                {new Date(ticket.event.startDate).toLocaleDateString('en-US', { 
                  month: 'short',
                  day: '2-digit'
                })}, {new Date(ticket.event.startDate).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
              <Text style={styles.eventLocationText}>at {ticket.event.location}</Text>
            </View>
          );
        })}
      </View>
      
      <View style={styles.statsSection}>
        <Text style={styles.statsSectionTitle}>Quick Stats</Text>
        
        <View style={styles.statRow}>
          <Text style={styles.statRowLabel}>Events This Month</Text>
          <Text style={styles.statRowValue}>{myTickets.length}</Text>
        </View>
        
        <View style={styles.statRow}>
          <Text style={styles.statRowLabel}>Total Spent</Text>
          <Text style={styles.statRowValue}>
            ${totalSpent}
          </Text>
        </View>
        
        <View style={[styles.statRow, styles.lastStatRow]}>
          <Text style={styles.statRowLabel}>Available Events</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.statRowValue}>{availableEvents.length}</Text>
            <Text style={styles.starIcon}>🎫</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  calendarContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  calendarContentContainer: {
    paddingBottom: 100,
  },
  calendarHeader: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15,
  },
  calendarTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 5,
  },
  calendarSubtitle: {
    fontSize: 16,
    color: '#6b7280',
  },
  calendarView: {
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  calendarMonthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  monthNavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarMonthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  weekdayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  weekdayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    textAlign: 'center',
    width: 35,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  dayButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentDayButton: {
    backgroundColor: '#9333ea',
  },
  eventDayButton: {
    backgroundColor: '#e879f9',
  },
  calendarDayText: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  currentDayText: {
    color: 'white',
    fontWeight: '600',
  },
  eventDayText: {
    color: 'white',
    fontWeight: '600',
  },
  eventIndicator: {
    width: 4,
    height: 4,
    backgroundColor: '#9333ea',
    borderRadius: 2,
    marginTop: 2,
  },
  upcomingEventsSection: {
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  upcomingEventsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 15,
  },
  upcomingEventItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  upcomingEventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  upcomingEventDate: {
    fontSize: 14,
    color: '#9333ea',
    fontWeight: '500',
    marginBottom: 2,
  },
  eventLocationText: {
    fontSize: 13,
    color: '#6b7280',
  },
  statsSection: {
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  statsSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 15,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  lastStatRow: {
    borderBottomWidth: 0,
  },
  statRowLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  statRowValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starIcon: {
    fontSize: 16,
  },
});
