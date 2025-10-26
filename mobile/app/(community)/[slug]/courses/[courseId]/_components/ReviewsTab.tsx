import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Course } from '../../../../../../lib/course-api';
import { useFeedback } from '../../../../../../hooks/use-feedback';
import FeedbackDisplay from '../../../../../../app/_components/FeedbackDisplay';
import FeedbackModal from '../../../../../../app/_components/FeedbackModal';
import { styles } from '../../styles';

interface ReviewsTabProps {
  course: Course | null;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({ course }) => {
  if (!course) {
    return <View style={styles.tabContent} />;
  }

  const {
    feedbackModalProps,
    openFeedbackModal,
  } = useFeedback({
    relatedModel: 'Cours',
    relatedTo: course._id,
    itemTitle: course.title,
  });

  return (
    <View style={styles.tabContent}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <FeedbackDisplay
          relatedModel="Cours"
          relatedTo={course._id}
          onAddFeedback={openFeedbackModal}
          showAddButton={true}
        />
      </ScrollView>

      <FeedbackModal {...feedbackModalProps} />
    </View>
  );
};
