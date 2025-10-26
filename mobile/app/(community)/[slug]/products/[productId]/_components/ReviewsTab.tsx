import React from 'react';
import { View, ScrollView } from 'react-native';
import { Product } from '../../../../../../lib/mock-data';
import { useFeedback } from '../../../../../../hooks/use-feedback';
import FeedbackDisplay from '../../../../../../app/_components/FeedbackDisplay';
import FeedbackModal from '../../../../../../app/_components/FeedbackModal';
import { styles } from '../../styles';

interface ReviewsTabProps {
  product: Product;
}

export const ReviewsTab: React.FC<ReviewsTabProps> = ({ product }) => {
  const {
    feedbackModalProps,
    openFeedbackModal,
  } = useFeedback({
    relatedModel: 'Product',
    relatedTo: product.id,
    itemTitle: product.title,
  });

  return (
    <View style={styles.tabContent}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <FeedbackDisplay
          relatedModel="Product"
          relatedTo={product.id}
          onAddFeedback={openFeedbackModal}
          showAddButton={true}
        />
      </ScrollView>

      <FeedbackModal {...feedbackModalProps} />
    </View>
  );
};
