import { apiClient, PaginationParams } from './client';

// ============================================================================
// Type Definitions
// ============================================================================

export type EmailCampaignStatus =
    | 'draft'
    | 'scheduled'
    | 'sending'
    | 'sent'
    | 'failed'
    | 'cancelled';

export type EmailCampaignType =
    | 'announcement'
    | 'newsletter'
    | 'promotion'
    | 'event_reminder'
    | 'course_update'
    | 'inactive_user_reactivation'
    | 'custom';

export type InactivityPeriod =
    | 'last_7_days'
    | 'last_15_days'
    | 'last_30_days'
    | 'last_60_days'
    | 'more_than_60_days';

export interface EmailRecipient {
    userId: string;
    email: string;
    name: string;
    status: 'pending' | 'sent' | 'failed';
    opened: boolean;
    clickCount: number;
    sentAt?: string;
    errorMessage?: string;
}

export interface EmailCampaign {
    _id: string;
    title: string;
    subject: string;
    content: string;
    communityId: string;
    creatorId: {
        _id: string;
        name: string;
        email: string;
    };
    type: EmailCampaignType;
    status: EmailCampaignStatus;
    recipients: EmailRecipient[];
    totalRecipients: number;
    sentCount: number;
    failedCount: number;
    openCount: number;
    clickCount: number;
    isHtml: boolean;
    trackOpens: boolean;
    trackClicks: boolean;
    isInactiveUserCampaign?: boolean;
    targetInactivityPeriod?: InactivityPeriod;
    targetDaysThreshold?: number;
    targetAllInactive?: boolean;
    scheduledAt?: string;
    sentAt?: string;
    createdAt: string;
    updatedAt?: string;
    metadata?: Record<string, any>;
}

export interface CampaignStats {
    totalCampaigns: number;
    totalEmailsSent: number;
    totalEmailsFailed: number;
    totalOpens: number;
    totalClicks: number;
    averageOpenRate: number;
    averageClickRate: number;
    reactivationCampaigns: number;
    reactivationSuccessRate: number;
}

export interface InactiveUserStats {
    totalMembers: number;
    activeUsers: number;
    inactiveUsers: number;
    inactivePercentage: number;
    breakdown: {
        inactive_7d: number;
        inactive_15d: number;
        inactive_30d: number;
        inactive_60d_plus: number;
    };
}

export interface UserLoginActivity {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
    };
    communityId: string;
    lastLoginAt: string;
    daysSinceLastLogin: number;
    inactivityStatus: 'active' | 'inactive_7d' | 'inactive_15d' | 'inactive_30d' | 'inactive_60d_plus';
    isReactivationTarget: boolean;
    lastReactivationEmailSent?: string;
    reactivationEmailCount: number;
    joinedAt: string;
    createdAt: string;
    updatedAt: string;
}

// ============================================================================
// Request DTOs
// ============================================================================

export interface CreateEmailCampaignDto {
    title: string;
    subject: string;
    content: string;
    communityId: string;
    type?: EmailCampaignType;
    isHtml?: boolean;
    trackOpens?: boolean;
    trackClicks?: boolean;
    scheduledAt?: string;
    metadata?: Record<string, any>;
}

export interface CreateInactiveUserCampaignDto {
    title: string;
    subject: string;
    content: string;
    communityId: string;
    inactivityPeriod: InactivityPeriod;
    targetAllInactive?: boolean;
    maxRecipients?: number;
    isHtml?: boolean;
    trackOpens?: boolean;
    trackClicks?: boolean;
    scheduledAt?: string;
    metadata?: Record<string, any>;
}

export interface UpdateEmailCampaignDto {
    title?: string;
    subject?: string;
    content?: string;
    status?: EmailCampaignStatus;
    scheduledAt?: string;
    isHtml?: boolean;
    trackOpens?: boolean;
    trackClicks?: boolean;
    metadata?: Record<string, any>;
}

export interface EmailCampaignQueryParams extends PaginationParams {
    status?: EmailCampaignStatus;
    type?: EmailCampaignType;
    inactiveUserCampaigns?: boolean;
    search?: string;
}

export interface InactiveUserQueryParams {
    period?: InactivityPeriod;
    limit?: number;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface GetCampaignsResponse {
    campaigns: EmailCampaign[];
    total: number;
    page: number;
    limit: number;
}

export interface SendCampaignResponse {
    message: string;
    campaignId: string;
}

// ============================================================================
// API Client Methods
// ============================================================================

export const emailCampaignsApi = {
    /**
     * Get all campaigns for a community with pagination and filters
     */
    async getCommunityCampaigns(
        communityId: string,
        params?: EmailCampaignQueryParams
    ): Promise<GetCampaignsResponse> {
        return apiClient.get<GetCampaignsResponse>(
            `/email-campaigns/community/${communityId}`,
            params
        );
    },

    /**
     * Get campaign statistics for a community
     */
    async getCampaignStats(communityId: string): Promise<CampaignStats> {
        return apiClient.get<CampaignStats>(
            `/email-campaigns/community/${communityId}/stats`
        );
    },

    /**
     * Get inactive user statistics for a community
     */
    async getInactiveUserStats(communityId: string): Promise<InactiveUserStats> {
        return apiClient.get<InactiveUserStats>(
            `/email-campaigns/community/${communityId}/inactive-stats`
        );
    },

    /**
     * Get inactive users for a community
     */
    async getInactiveUsers(
        communityId: string,
        params?: InactiveUserQueryParams
    ): Promise<UserLoginActivity[]> {
        return apiClient.get<UserLoginActivity[]>(
            `/email-campaigns/community/${communityId}/inactive-users`,
            params
        );
    },

    /**
     * Get a specific campaign by ID
     */
    async getCampaign(campaignId: string): Promise<EmailCampaign> {
        return apiClient.get<EmailCampaign>(`/email-campaigns/${campaignId}`);
    },

    /**
     * Create a regular email campaign
     */
    async createCampaign(data: CreateEmailCampaignDto): Promise<EmailCampaign> {
        return apiClient.post<EmailCampaign>('/email-campaigns', data);
    },

    /**
     * Create an inactive user reactivation campaign
     */
    async createInactiveUserCampaign(
        data: CreateInactiveUserCampaignDto
    ): Promise<EmailCampaign> {
        return apiClient.post<EmailCampaign>('/email-campaigns/inactive-users', data);
    },

    /**
     * Update a campaign (only works for draft campaigns)
     */
    async updateCampaign(
        campaignId: string,
        data: UpdateEmailCampaignDto
    ): Promise<EmailCampaign> {
        return apiClient.put<EmailCampaign>(`/email-campaigns/${campaignId}`, data);
    },

    /**
     * Delete a campaign (only works for draft campaigns)
     */
    async deleteCampaign(campaignId: string): Promise<void> {
        return apiClient.delete<void>(`/email-campaigns/${campaignId}`);
    },

    /**
     * Send a campaign to all recipients
     */
    async sendCampaign(campaignId: string): Promise<SendCampaignResponse> {
        return apiClient.post<SendCampaignResponse>(
            `/email-campaigns/${campaignId}/send`
        );
    },
};
