/**
 * Feedback Hook
 * 
 * A custom hook to manage feedback functionality throughout the app.
 * Provides easy access to feedback modal, rating display, and feedback management.
 */

import { useState, useCallback } from 'react';
import {
  FeedbackModel,
  CreateFeedbackData,
  createFeedback,
  getFeedbackForItem,
} from '../lib/feedback-api';

interface UseFeedbackProps {
  relatedModel: FeedbackModel;
  relatedTo: string;
  itemTitle?: string;
}

interface UseFeedbackReturn {
  // Modal state
  showFeedbackModal: boolean;
  openFeedbackModal: () => void;
  closeFeedbackModal: () => void;
  
  // Feedback submission
  submitFeedback: (rating: number, comment?: string) => Promise<void>;
  submitting: boolean;
  
  // Feedback data
  refreshFeedback: () => void;
  
  // Modal props (for easy spreading)
  feedbackModalProps: {
    visible: boolean;
    onClose: () => void;
    onFeedbackSubmitted: (feedback: any) => void;
    relatedModel: FeedbackModel;
    relatedTo: string;
    itemTitle?: string;
  };
}

export function useFeedback({ 
  relatedModel, 
  relatedTo, 
  itemTitle 
}: UseFeedbackProps): UseFeedbackReturn {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const openFeedbackModal = useCallback(() => {
    setShowFeedbackModal(true);
  }, []);

  const closeFeedbackModal = useCallback(() => {
    setShowFeedbackModal(false);
  }, []);

  const submitFeedback = useCallback(async (rating: number, comment?: string) => {
    try {
      setSubmitting(true);
      
      const feedbackData: CreateFeedbackData = {
        relatedTo,
        relatedModel,
        rating,
        comment: comment?.trim() || undefined,
      };

      await createFeedback(feedbackData);
      
      // Trigger refresh of feedback displays
      setRefreshTrigger(prev => prev + 1);
      
      // Close modal
      setShowFeedbackModal(false);
      
    } catch (error) {
      throw error; // Let the component handle the error
    } finally {
      setSubmitting(false);
    }
  }, [relatedModel, relatedTo]);

  const refreshFeedback = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const handleFeedbackSubmitted = useCallback((feedback: any) => {
    refreshFeedback();
    closeFeedbackModal();
  }, [refreshFeedback, closeFeedbackModal]);

  const feedbackModalProps = {
    visible: showFeedbackModal,
    onClose: closeFeedbackModal,
    onFeedbackSubmitted: handleFeedbackSubmitted,
    relatedModel,
    relatedTo,
    itemTitle,
  };

  return {
    showFeedbackModal,
    openFeedbackModal,
    closeFeedbackModal,
    submitFeedback,
    submitting,
    refreshFeedback,
    feedbackModalProps,
  };
}

// Quick feedback trigger hook for simple use cases
export function useQuickFeedback() {
  const [activeModal, setActiveModal] = useState<{
    relatedModel: FeedbackModel;
    relatedTo: string;
    itemTitle?: string;
  } | null>(null);

  const showFeedbackFor = useCallback((
    relatedModel: FeedbackModel, 
    relatedTo: string, 
    itemTitle?: string
  ) => {
    setActiveModal({ relatedModel, relatedTo, itemTitle });
  }, []);

  const closeFeedback = useCallback(() => {
    setActiveModal(null);
  }, []);

  return {
    activeModal,
    showFeedbackFor,
    closeFeedback,
    isVisible: activeModal !== null,
  };
}
