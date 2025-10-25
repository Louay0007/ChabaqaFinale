import { colors } from '@/lib/design-tokens';
import { BookOpen, Clock, MessageSquare, Trophy, X } from 'lucide-react-native';
import React from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { modalStyles } from './modal-styles';

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
}

// Mock data pour les notifications
const notifications = [
  {
    id: 1,
    type: 'challenge',
    icon: Trophy,
    title: 'New challenge day',
    message: 'Day 19 of 30-Day Coding Challenge is now available',
    time: '2 hours ago',
    read: false,
  },
  {
    id: 2,
    type: 'course',
    icon: BookOpen,
    title: 'Course update',
    message: 'New chapter added to React Fundamentals',
    time: '4 hours ago',
    read: false,
  },
  {
    id: 3,
    type: 'session',
    icon: Clock,
    title: 'Session reminder',
    message: 'Your 1-on-1 session starts in 30 minutes',
    time: '6 hours ago',
    read: false,
  },
  {
    id: 4,
    type: 'message',
    icon: MessageSquare,
    title: 'New comment',
    message: 'Someone replied to your post in Digital Marketing',
    time: '1 day ago',
    read: true,
  },
  {
    id: 5,
    type: 'challenge',
    icon: Trophy,
    title: 'Challenge completed',
    message: 'Congratulations! You completed the JavaScript Challenge',
    time: '2 days ago',
    read: true,
  },
];

export default function NotificationModal({ visible, onClose }: NotificationModalProps) {
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'challenge':
        return '#f59e0b';
      case 'course':
        return '#3b82f6';
      case 'session':
        return '#10b981';
      case 'message':
        return '#8b5cf6';
      default:
        return '#6b7280';
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={modalStyles.notificationContainer}>
        {/* Header */}
        <View style={modalStyles.modalHeader}>
          <Text style={modalStyles.notificationHeaderTitle}>Notifications</Text>
          <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
            <X size={24} color={colors.gray500} />
          </TouchableOpacity>
        </View>

        {/* Notifications List */}
        <ScrollView style={modalStyles.scrollContainer} showsVerticalScrollIndicator={false}>
          {notifications.map((notification) => {
            const IconComponent = notification.icon;
            return (
              <TouchableOpacity
                key={notification.id}
                style={[
                  modalStyles.listItem,
                  !notification.read && modalStyles.notificationUnreadItem
                ]}
                activeOpacity={0.7}
              >
                <View style={modalStyles.listItemContent}>
                  <View style={[
                    modalStyles.iconContainer,
                    { backgroundColor: `${getNotificationColor(notification.type)}20` }
                  ]}>
                    <IconComponent 
                      size={20} 
                      color={getNotificationColor(notification.type)} 
                    />
                  </View>
                  
                  <View style={modalStyles.notificationTextContainer}>
                    <Text style={modalStyles.notificationTitle}>
                      {notification.title}
                    </Text>
                    <Text style={modalStyles.notificationMessage}>
                      {notification.message}
                    </Text>
                    <Text style={modalStyles.notificationTime}>
                      {notification.time}
                    </Text>
                  </View>
                  
                  {!notification.read && (
                    <View style={[modalStyles.notificationUnreadDot, modalStyles.unreadIndicator]} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Footer */}
        <View style={modalStyles.notificationFooter}>
          <TouchableOpacity style={modalStyles.notificationMarkAllReadButton}>
            <Text style={modalStyles.notificationMarkAllReadText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
