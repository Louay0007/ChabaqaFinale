import { ChallengeTask } from '@/lib/challenge-utils';
import { CheckCircle } from 'lucide-react-native';
import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles';

interface TimelineTabProps {
  challengeTasks: ChallengeTask[];
  completedTasks: number;
  formatDate: (date: Date) => string;
}

interface TaskItemProps {
  item: ChallengeTask;
  currentTask: ChallengeTask | undefined;
  onTaskSelect: (day: number) => void;
}

function TaskItem({ item, currentTask, onTaskSelect }: TaskItemProps) {
  const isActive = currentTask?.id === item.id;

  return (
    <TouchableOpacity
      style={[
        styles.taskItem,
        item.isCompleted && styles.completedTaskItem,
        isActive && styles.activeTaskItem,
      ]}
      onPress={() => onTaskSelect(item.day)}
    >
      <View style={styles.taskHeader}>
        <View style={styles.taskDayContainer}>
          <Text style={styles.taskDay}>Day {item.day}</Text>
          <Text style={styles.taskPoints}>{item.points} pts</Text>
        </View>
        <View style={styles.taskStatus}>
          {item.isCompleted ? (
            <CheckCircle size={16} color="#10b981" />
          ) : (
            <View 
              style={[
                styles.taskStatusIndicator,
                item.isActive ? styles.activeTaskIndicator : styles.inactiveTaskIndicator
              ]} 
            />
          )}
        </View>
      </View>
      <Text style={styles.taskTitle}>{item.title}</Text>
      <Text style={styles.taskDescription} numberOfLines={2}>{item.description}</Text>
    </TouchableOpacity>
  );
}

export default function TimelineTab({
  challengeTasks,
  completedTasks,
  formatDate,
}: TimelineTabProps) {
  const currentTask = challengeTasks.find((t: ChallengeTask) => t.isActive) || challengeTasks[0];

  const handleTaskSelect = (day: number) => {
    // This would typically update the selected task in the parent component
    console.log('Selected task day:', day);
  };

  const renderTask = ({ item }: { item: ChallengeTask }) => (
    <TaskItem 
      item={item} 
      currentTask={currentTask} 
      onTaskSelect={handleTaskSelect} 
    />
  );

  return (
    <View style={styles.tabContent}>
      <View style={styles.timelineCard}>
        <Text style={styles.cardTitle}>Challenge Timeline</Text>
        <Text style={styles.cardSubtitle}>Track your progress through all challenge days</Text>
        
        <FlatList
          data={challengeTasks}
          renderItem={renderTask}
          keyExtractor={item => item.id}
          style={styles.tasksList}
          scrollEnabled={false}
        />
      </View>
    </View>
  );
}
