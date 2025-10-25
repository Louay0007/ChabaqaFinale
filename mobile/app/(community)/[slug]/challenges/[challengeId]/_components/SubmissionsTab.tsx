import { CheckCircle } from 'lucide-react-native';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../../styles';

interface Submission {
  id: string;
  taskDay: number;
  taskTitle: string;
  submittedAt: Date;
  status: 'approved' | 'pending' | 'rejected';
  score?: number;
  feedback?: string;
  submissionUrl?: string;
}

interface SubmissionsTabProps {
  submissions?: Submission[];
  onSubmitNew?: () => void;
}

// Composant pour afficher une soumission individuelle
function SubmissionItem({ submission, formatDate }: { submission: any; formatDate: (date: Date) => string }) {
  return (
    <View style={styles.submissionItem}>
      <View style={styles.submissionHeader}>
        <Text style={styles.submissionTitle}>
          Day {submission.taskDay || submission.day}: {submission.taskTitle || submission.title}
        </Text>
        <CheckCircle size={16} color="#10b981" />
      </View>
      <Text style={styles.submissionDate}>
        Completed on {formatDate(submission.submittedAt || new Date())}
      </Text>
      {submission.feedback && (
        <View style={styles.feedbackContainer}>
          <Text style={styles.feedbackLabel}>Feedback:</Text>
          <Text style={styles.feedbackText}>{submission.feedback}</Text>
        </View>
      )}
    </View>
  );
}

export default function SubmissionsTab({ submissions, onSubmitNew }: SubmissionsTabProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Si nous n'avons pas de soumissions passées en props, nous utilisons des soumissions fictives
  // basées sur les tâches complétées (pour compatibilité avec l'ancien code)
  const displaySubmissions = submissions || [];

  return (
    <View style={styles.tabContent}>
      <View style={styles.submissionsCard}>
        <Text style={styles.cardTitle}>My Submissions</Text>
        <Text style={styles.cardSubtitle}>Review your completed projects and feedback</Text>
        
        {onSubmitNew && (
          <TouchableOpacity 
            style={[styles.submitButton, { marginBottom: 16 }]} 
            onPress={onSubmitNew}
          >
            <Text style={styles.submitButtonText}>Submit New Work</Text>
          </TouchableOpacity>
        )}
        
        {displaySubmissions.length > 0 ? (
          displaySubmissions.map((submission) => (
            <SubmissionItem 
              key={submission.id} 
              submission={submission} 
              formatDate={formatDate} 
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No submissions yet</Text>
          </View>
        )}
      </View>
    </View>
  );
}
