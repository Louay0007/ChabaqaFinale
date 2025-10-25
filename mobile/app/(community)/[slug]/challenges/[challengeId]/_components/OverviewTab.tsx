import { ChallengeTask } from '@/lib/challenge-utils';
import { Challenge } from '@/lib/mock-data';
import { BookOpen, Code, ExternalLink, FileText, PlayCircle, Target } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles';

interface OverviewTabProps {
  currentTask: ChallengeTask | undefined;
  challenge: Challenge;
  completedTasks: number;
  challengeTasks: ChallengeTask[];
  formatDate: (date: Date) => string;
}

const getResourceIcon = (type: string) => {
  switch (type) {
    case 'video':
      return <PlayCircle size={16} color="#6b7280" />;
    case 'article':
      return <FileText size={16} color="#6b7280" />;
    case 'code':
      return <Code size={16} color="#6b7280" />;
    case 'tool':
      return <ExternalLink size={16} color="#6b7280" />;
    default:
      return <BookOpen size={16} color="#6b7280" />;
  }
};

export default function OverviewTab({
  currentTask,
  challenge,
  completedTasks,
  challengeTasks,
  formatDate,
}: OverviewTabProps) {
  return (
    <View style={styles.tabContent}>
      {/* Current Task */}
      {currentTask && (
        <View style={styles.currentTaskCard}>
          <View style={styles.cardHeader}>
            <View style={styles.cardTitleContainer}>
              <Target size={16} color="#f97316" />
              <Text style={styles.cardTitle}>Day {currentTask.day} Challenge</Text>
            </View>
            <View style={styles.pointsBadge}>
              <Text style={styles.pointsText}>{currentTask.points} pts</Text>
            </View>
          </View>
          
          <View style={styles.cardContent}>
            <Text style={styles.taskCardTitle}>{currentTask.title}</Text>
            <Text style={styles.taskCardDescription}>{currentTask.description}</Text>
            
            <Text style={styles.resourcesAndInstructionsTitle}>Resources & Instructions</Text>
            
            {currentTask.instructions && (
              <View style={styles.instructionsContainer}>
                <Text style={styles.instructionsTitle}>Instructions:</Text>
                <Text style={styles.instructionsText}>{currentTask.instructions}</Text>
              </View>
            )}
            
            {currentTask.resources && currentTask.resources.length > 0 && (
              <View style={styles.taskResourcesContainer}>
                {currentTask.resources.map((resource: any, index: number) => (
                  <TouchableOpacity key={index} style={styles.taskResourceItem}>
                    {getResourceIcon(resource.type)}
                    <View style={styles.resourceInfo}>
                      <Text style={styles.resourceTitle}>{resource.title}</Text>
                      <Text style={styles.resourceDescription}>
                        {resource.type === 'video' ? '15-minute video covering basics' : 'Complete guide and reference'}
                      </Text>
                    </View>
                    <ExternalLink size={16} color="#6b7280" />
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            <View style={styles.actionsContainer}>
              {!currentTask.isCompleted && (
                <TouchableOpacity style={styles.submitButton}>
                  <Text style={styles.submitButtonText}>Submit Your Work</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity style={styles.helpButton}>
                <Text style={styles.helpButtonText}>Get Help</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Progress Card */}
      <View style={styles.progressCard}>
        <Text style={styles.cardTitle}>Your Progress</Text>
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>
            {Math.round((completedTasks / challengeTasks.length) * 100)}%
          </Text>
          <View style={styles.progressBarContainer}>
            <View 
              style={[
                styles.progressBar,
                { width: `${(completedTasks / challengeTasks.length) * 100}%` }
              ]} 
            />
          </View>
        </View>
      </View>

      {/* Challenge Info Card */}
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>Challenge Info</Text>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Start Date:</Text>
          <Text style={styles.infoValue}>{formatDate(challenge.startDate)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>End Date:</Text>
          <Text style={styles.infoValue}>{formatDate(challenge.endDate)}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Difficulty:</Text>
          <Text style={styles.infoValue}>{challenge.difficulty}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>Deposit:</Text>
          <Text style={styles.infoValue}>${challenge.depositAmount}</Text>
        </View>
        {challenge.notes && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesTitle}>Notes:</Text>
            <Text style={styles.notesText}>{challenge.notes}</Text>
          </View>
        )}
      </View>

      {challenge.resources && challenge.resources.length > 0 && (
        <View style={styles.resourcesCard}>
          <Text style={styles.cardTitle}>Resources</Text>
          {challenge.resources.map((resource: any, index: number) => (
            <TouchableOpacity key={index} style={styles.resourceItem}>
              {getResourceIcon(resource.type)}
              <Text style={styles.resourceText}>{resource.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
