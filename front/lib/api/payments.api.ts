import { apiClient, ApiSuccessResponse, PaginatedResponse, PaginationParams } from './client';
import type { PaymentIntent, Subscription } from './types';

export interface CreatePaymentIntentData {
  amount: number;
  currency?: string;
  metadata?: Record<string, any>;
}

export interface ConfirmPaymentData {
  paymentIntentId: string;
  paymentMethodId: string;
}

export interface CreateSubscriptionData {
  communityId: string;
  priceId: string;
}

export interface RequestPayoutData {
  amount: number;
  method?: string;
}

// Payments API
export const paymentsApi = {
  // Create payment intent
  createIntent: async (data: CreatePaymentIntentData): Promise<ApiSuccessResponse<PaymentIntent>> => {
    return apiClient.post<ApiSuccessResponse<PaymentIntent>>('/payments/intent', data);
  },

  // Confirm payment
  confirm: async (data: ConfirmPaymentData): Promise<ApiSuccessResponse<any>> => {
    return apiClient.post<ApiSuccessResponse<any>>('/payments/confirm', data);
  },

  // Get payment by ID
  getById: async (id: string): Promise<ApiSuccessResponse<any>> => {
    return apiClient.get<ApiSuccessResponse<any>>(`/payments/${id}`);
  },

  // Create subscription
  createSubscription: async (data: CreateSubscriptionData): Promise<ApiSuccessResponse<Subscription>> => {
    return apiClient.post<ApiSuccessResponse<Subscription>>('/payments/subscriptions', data);
  },

  // Get subscription by ID
  getSubscription: async (id: string): Promise<ApiSuccessResponse<Subscription>> => {
    return apiClient.get<ApiSuccessResponse<Subscription>>(`/payments/subscriptions/${id}`);
  },

  // Get payouts
  getPayouts: async (params?: PaginationParams): Promise<PaginatedResponse<any>> => {
    return apiClient.get<PaginatedResponse<any>>('/payments/payouts', params);
  },

  // Request payout
  requestPayout: async (data: RequestPayoutData): Promise<ApiSuccessResponse<any>> => {
    return apiClient.post<ApiSuccessResponse<any>>('/payments/payouts/request', data);
  },
};
