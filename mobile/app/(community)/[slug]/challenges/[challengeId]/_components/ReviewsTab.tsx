import React from 'react';
import { View, ScrollView } from 'react-native';
import { Challenge } from '../../../../../../lib/mock-data';
import { useFeedback } from '../../../../../../hooks/use-feedback';
import FeedbackDisplay from '../../../../../../app/_components/FeedbackDisplay';
import FeedbackModal from '../../../../../../app/_components/FeedbackModal';
import { styles } from '../../styles';

interface ReviewsTabProps {
  challenge: Challenge | null;
}

export default function ReviewsTab({ challenge }: ReviewsTabProps) {
  if (!challenge) {
    return <View style={styles.tabContent} />;
  }

  const {
    feedbackModalProps,
    openFeedbackModal,
  } = useFeedback({
    relatedModel: 'Challenge',
    relatedTo: challenge.id,
    itemTitle: challenge.title,
  });

  return (
    <View style={styles.tabContent}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <FeedbackDisplay
          relatedModel="Challenge"
          relatedTo={challenge.id}
          onAddFeedback={openFeedbackModal}
          showAddButton={true}
        />
      </ScrollView>

      <FeedbackModal {...feedbackModalProps} />
    </View>
  );
}
