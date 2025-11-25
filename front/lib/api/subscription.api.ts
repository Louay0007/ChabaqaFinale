import { apiClient, ApiSuccessResponse } from './client';
import type { User } from './types';

export interface SubscriptionPlan {
  tier: 'starter' | 'growth' | 'pro';
  price: number;
  currency: string;
  trialDays: number;
  limits: {
    communitiesMax: number;
    membersMax: number;
    coursesActivationMax: number;
    storageGB: number;
    adminsMax: number;
  };
  features: string[];
}

export interface CreatorSubscription {
  _id: string;
  creatorId: string;
  plan: SubscriptionPlan;
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete';
  cancelAtPeriodEnd: boolean;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  trialEndsAt?: string;
  hasPaymentMethod: boolean;
  paymentBrand?: string;
  paymentLast4?: string;
  provider?: string;
  providerCustomerId?: string;
  providerSubscriptionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrialRemaining {
  isTrialing: boolean;
  expiresAt: string | null;
  remaining: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMs: number;
  };
  message: string;
}

export interface SetupBillingData {
  providerCustomerId: string;
  paymentBrand?: string;
  paymentLast4?: string;
}

export interface UpgradePlanData {
  tier: 'starter' | 'growth' | 'pro';
}

// Subscription API
export const subscriptionApi = {
  /**
   * Get current creator's subscription
   */
  getMySubscription: async (): Promise<ApiSuccessResponse<CreatorSubscription>> => {
    return apiClient.get<ApiSuccessResponse<CreatorSubscription>>('/subscriptions/me');
  },

  /**
   * Start trial for creator
   */
  startTrial: async (): Promise<ApiSuccessResponse<{ message: string; subscription: CreatorSubscription }>> => {
    return apiClient.post<ApiSuccessResponse<{ message: string; subscription: CreatorSubscription }>>('/subscriptions/start-trial');
  },

  /**
   * Setup billing method for creator
   */
  setupBilling: async (data: SetupBillingData): Promise<ApiSuccessResponse<{ message: string; subscription: CreatorSubscription }>> => {
    return apiClient.post<ApiSuccessResponse<{ message: string; subscription: CreatorSubscription }>>('/subscriptions/setup-billing', data);
  },

  /**
   * Upgrade plan tier
   */
  upgradePlan: async (data: UpgradePlanData): Promise<ApiSuccessResponse<{ message: string; subscription: CreatorSubscription }>> => {
    return apiClient.post<ApiSuccessResponse<{ message: string; subscription: CreatorSubscription }>>('/subscriptions/upgrade', data);
  },

  /**
   * Cancel subscription at period end
   */
  cancelSubscription: async (): Promise<ApiSuccessResponse<{ message: string; subscription: CreatorSubscription }>> => {
    return apiClient.post<ApiSuccessResponse<{ message: string; subscription: CreatorSubscription }>>('/subscriptions/cancel');
  },

  /**
   * Get trial remaining time
   */
  getTrialRemaining: async (): Promise<ApiSuccessResponse<TrialRemaining>> => {
    return apiClient.get<ApiSuccessResponse<TrialRemaining>>('/subscriptions/trial-remaining');
  },

  /**
   * Get all available plans
   */
  getPlans: async (): Promise<ApiSuccessResponse<SubscriptionPlan[]>> => {
    return apiClient.get<ApiSuccessResponse<SubscriptionPlan[]>>('/plans');
  },

  /**
   * Check if creator has active subscription
   */
  hasActiveSubscription: async (): Promise<boolean> => {
    try {
      const response = await subscriptionApi.getMySubscription();
      const subscription = response.data;
      
      if (!subscription) return false;
      
      return subscription.status === 'active' || subscription.status === 'trialing';
    } catch {
      return false;
    }
  },

  /**
   * Get subscription status summary
   */
  getSubscriptionSummary: async (): Promise<{
    hasSubscription: boolean;
    isActive: boolean;
    isTrialing: boolean;
    plan: string;
    currentPeriodEnd: string;
    cancelAtPeriodEnd: boolean;
    hasPaymentMethod: boolean;
  }> => {
    try {
      const response = await subscriptionApi.getMySubscription();
      const subscription = response.data;
      
      if (!subscription) {
        return {
          hasSubscription: false,
          isActive: false,
          isTrialing: false,
          plan: 'none',
          currentPeriodEnd: '',
          cancelAtPeriodEnd: false,
          hasPaymentMethod: false
        };
      }

      const now = new Date();
      const periodEnd = new Date(subscription.currentPeriodEnd);
      const isTrialing = subscription.status === 'trialing' && subscription.trialEndsAt && new Date(subscription.trialEndsAt) > now;
      const isActive = subscription.status === 'active' && periodEnd > now;

      return {
        hasSubscription: true,
        isActive: Boolean(isActive),
        isTrialing: Boolean(isTrialing),
        plan: subscription.plan?.tier || subscription.plan || 'unknown',
        currentPeriodEnd: subscription.currentPeriodEnd || '',
        cancelAtPeriodEnd: Boolean(subscription.cancelAtPeriodEnd),
        hasPaymentMethod: Boolean(subscription.hasPaymentMethod)
      };
    } catch {
      return {
        hasSubscription: false,
        isActive: false,
        isTrialing: false,
        plan: 'none',
        currentPeriodEnd: '',
        cancelAtPeriodEnd: false,
        hasPaymentMethod: false
      };
    }
  }
};