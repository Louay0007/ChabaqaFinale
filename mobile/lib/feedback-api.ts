/**
 * Feedback API Integration
 * 
 * Provides functions to interact with the feedback endpoints.
 * Handles ratings and reviews for courses, sessions, events, products, communities, and challenges.
 * 
 * @module feedback-api
 */

import { tryEndpoints } from './http';
import { getAccessToken } from './auth';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

/**
 * Supported feedback models
 */
export type FeedbackModel = 'Community' | 'Cours' | 'Challenge' | 'Event' | 'Product' | 'Session';

/**
 * Feedback object
 */
export interface Feedback {
  _id: string;
  relatedTo: string;
  relatedModel: FeedbackModel;
  user: string;
  rating: number; // 1-5 stars
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Create feedback data
 */
export interface CreateFeedbackData {
  relatedTo: string;
  relatedModel: FeedbackModel;
  rating: number; // 1-5 stars
  comment?: string;
}

/**
 * Feedback statistics
 */
export interface FeedbackStats {
  averageRating: number;
  totalCount: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

/**
 * Feedback list response
 */
export interface FeedbackListResponse {
  feedbacks: Feedback[];
  stats: FeedbackStats;
  userFeedback?: Feedback; // Current user's feedback if exists
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Create feedback for an item
 * 
 * @param feedbackData - Feedback data to create
 * @returns Promise with created feedback
 */
export async function createFeedback(feedbackData: CreateFeedbackData): Promise<Feedback> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required to create feedback');
    }

    console.log('⭐ [FEEDBACK-API] Creating feedback:', { 
      model: feedbackData.relatedModel, 
      rating: feedbackData.rating 
    });

    const resp = await tryEndpoints<any>(
      `/api/feedback`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: feedbackData,
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [FEEDBACK-API] Feedback created successfully');
      return resp.data;
    }

    throw new Error(resp.data.message || 'Failed to create feedback');
  } catch (error: any) {
    console.error('💥 [FEEDBACK-API] Error creating feedback:', error);
    throw new Error(error.message || 'Failed to create feedback');
  }
}

/**
 * Get feedback for a specific item
 * 
 * @param relatedModel - Model type (Course, Session, etc.)
 * @param relatedTo - Item ID
 * @returns Promise with feedback list and statistics
 */
export async function getFeedbackForItem(
  relatedModel: FeedbackModel, 
  relatedTo: string
): Promise<FeedbackListResponse> {
  try {
    console.log('📊 [FEEDBACK-API] Fetching feedback:', { relatedModel, relatedTo });

    const resp = await tryEndpoints<any>(
      `/api/feedback/${relatedModel}/${relatedTo}`,
      {
        method: 'GET',
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      const feedbacks = Array.isArray(resp.data) ? resp.data : [];
      const stats = calculateFeedbackStats(feedbacks);
      
      console.log('✅ [FEEDBACK-API] Feedback fetched:', feedbacks.length);
      
      return {
        feedbacks,
        stats,
        userFeedback: undefined, // Will be set by getUserFeedback if needed
      };
    }

    throw new Error(resp.data.message || 'Failed to fetch feedback');
  } catch (error: any) {
    console.error('💥 [FEEDBACK-API] Error fetching feedback:', error);
    throw new Error(error.message || 'Failed to fetch feedback');
  }
}

/**
 * Check if user has already given feedback for an item
 * 
 * @param relatedModel - Model type
 * @param relatedTo - Item ID
 * @returns Promise with user's feedback if exists
 */
export async function getUserFeedback(
  relatedModel: FeedbackModel, 
  relatedTo: string
): Promise<Feedback | null> {
  try {
    const token = await getAccessToken();
    if (!token) {
      return null; // Not authenticated, no user feedback
    }

    const response = await getFeedbackForItem(relatedModel, relatedTo);
    
    // Note: This is a workaround since backend doesn't have a specific endpoint
    // for user's own feedback. In production, this would be more efficient with
    // a dedicated endpoint like GET /api/feedback/my/:relatedModel/:relatedTo
    
    return null; // For now, we'll assume no existing feedback
  } catch (error: any) {
    console.error('💥 [FEEDBACK-API] Error getting user feedback:', error);
    return null;
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Calculate feedback statistics from feedback array
 * 
 * @param feedbacks - Array of feedback objects
 * @returns Calculated statistics
 */
export function calculateFeedbackStats(feedbacks: Feedback[]): FeedbackStats {
  if (feedbacks.length === 0) {
    return {
      averageRating: 0,
      totalCount: 0,
      ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
    };
  }

  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalRating = 0;

  feedbacks.forEach(feedback => {
    totalRating += feedback.rating;
    ratingDistribution[feedback.rating as keyof typeof ratingDistribution]++;
  });

  return {
    averageRating: totalRating / feedbacks.length,
    totalCount: feedbacks.length,
    ratingDistribution,
  };
}

/**
 * Get star rating display
 * 
 * @param rating - Rating value (1-5)
 * @returns Star rating string representation
 */
export function getStarRating(rating: number): string {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return '★'.repeat(fullStars) + 
         (hasHalfStar ? '☆' : '') + 
         '☆'.repeat(emptyStars);
}

/**
 * Get rating color based on rating value
 * 
 * @param rating - Rating value (1-5)
 * @returns Color code for the rating
 */
export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return '#10b981'; // Green - Excellent
  if (rating >= 4.0) return '#84cc16'; // Light Green - Very Good
  if (rating >= 3.5) return '#eab308'; // Yellow - Good
  if (rating >= 3.0) return '#f59e0b'; // Orange - Fair
  if (rating >= 2.0) return '#ef4444'; // Red - Poor
  return '#991b1b'; // Dark Red - Very Poor
}

/**
 * Get rating text description
 * 
 * @param rating - Rating value (1-5)
 * @returns Text description of the rating
 */
export function getRatingText(rating: number): string {
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 4.0) return 'Very Good';
  if (rating >= 3.5) return 'Good';
  if (rating >= 3.0) return 'Fair';
  if (rating >= 2.0) return 'Poor';
  return 'Very Poor';
}

/**
 * Format feedback time display
 * 
 * @param dateString - ISO date string
 * @returns Formatted time string
 */
export function formatFeedbackTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

/**
 * Get feedback model display name
 * 
 * @param model - Feedback model type
 * @returns Human-readable model name
 */
export function getModelDisplayName(model: FeedbackModel): string {
  const modelNames: Record<FeedbackModel, string> = {
    'Community': 'Community',
    'Cours': 'Course',
    'Challenge': 'Challenge',
    'Event': 'Event',
    'Product': 'Product',
    'Session': 'Session',
  };
  
  return modelNames[model] || model;
}

/**
 * Get feedback prompt text based on model type
 * 
 * @param model - Feedback model type
 * @returns Appropriate prompt text
 */
export function getFeedbackPrompt(model: FeedbackModel): string {
  const prompts: Record<FeedbackModel, string> = {
    'Community': 'How would you rate this community?',
    'Cours': 'How would you rate this course?',
    'Challenge': 'How would you rate this challenge?',
    'Event': 'How would you rate this event?',
    'Product': 'How would you rate this product?',
    'Session': 'How would you rate this session?',
  };
  
  return prompts[model] || 'How would you rate this?';
}

/**
 * Validate rating value
 * 
 * @param rating - Rating to validate
 * @returns True if rating is valid (1-5)
 */
export function isValidRating(rating: number): boolean {
  return Number.isInteger(rating) && rating >= 1 && rating <= 5;
}

/**
 * Get feedback emoji for rating
 * 
 * @param rating - Rating value (1-5)
 * @returns Emoji representation
 */
export function getFeedbackEmoji(rating: number): string {
  const emojis = {
    1: '😞',
    2: '😐',
    3: '🙂',
    4: '😊',
    5: '🤩'
  };
  
  return emojis[rating as keyof typeof emojis] || '😐';
}

/**
 * Check if feedback can be edited
 * 
 * @param feedback - Feedback object
 * @param maxEditTimeHours - Maximum hours after creation to allow edits
 * @returns True if feedback can still be edited
 */
export function canEditFeedback(feedback: Feedback, maxEditTimeHours: number = 24): boolean {
  const createdAt = new Date(feedback.createdAt);
  const now = new Date();
  const diffHours = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60);
  
  return diffHours <= maxEditTimeHours;
}
