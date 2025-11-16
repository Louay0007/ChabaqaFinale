/**
 * Direct Messages API Integration
 * 
 * Provides functions to interact with the DM endpoints for user communication.
 * Handles conversations with community creators and help desk support.
 * 
 * @module dm-api
 */

import { tryEndpoints } from './http';
import { getAccessToken } from './auth';

// ============================================================================
// TypeScript Interfaces
// ============================================================================

/**
 * Message attachment
 */
export interface MessageAttachment {
  url: string;
  type: 'image' | 'file' | 'video';
  size: number;
}

/**
 * Direct message
 */
export interface DMMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  text?: string;
  attachments: MessageAttachment[];
  readAt?: string;
  editedAt?: string;
  deletedFor: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * User information for conversation participants
 */
export interface ConversationParticipant {
  _id: string;
  name: string;
  email: string;
  profile_picture?: string;
  photo_profil?: string; // Admin profile picture field
  role?: string;
  poste?: string; // Admin position
  departement?: string; // Admin department
}

/**
 * Community information for community conversations
 */
export interface ConversationCommunity {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
}

/**
 * DM Conversation
 */
export interface DMConversation {
  _id: string;
  type: 'COMMUNITY_DM' | 'HELP_DM';
  participantA: ConversationParticipant;
  participantB?: ConversationParticipant;
  communityId?: ConversationCommunity;
  lastMessageText: string;
  lastMessageAt?: string;
  unreadCountA: number;
  unreadCountB: number;
  isOpen: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Conversation list response
 */
export interface ConversationListResponse {
  conversations: DMConversation[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Messages list response
 */
export interface MessagesListResponse {
  messages: DMMessage[];
  conversation?: DMConversation;
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Send message data
 */
export interface SendMessageData {
  text?: string;
  attachments?: MessageAttachment[];
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Start a conversation with community creator
 * 
 * @param communityId - Community ID to start conversation with creator
 * @returns Promise with conversation details
 */
export async function startCommunityConversation(communityId: string): Promise<DMConversation> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required to start conversation');
    }

    console.log('💬 [DM-API] Starting community conversation:', communityId);

    const resp = await tryEndpoints<any>(
      `/api/dm/community/start`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: { communityId },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [DM-API] Community conversation started');
      return resp.data.conversation;
    }

    throw new Error(resp.data.message || 'Failed to start conversation');
  } catch (error: any) {
    console.error('💥 [DM-API] Error starting community conversation:', error);
    throw new Error(error.message || 'Failed to start conversation');
  }
}

/**
 * Start a help conversation with admin
 * 
 * @returns Promise with help conversation details
 */
export async function startHelpConversation(): Promise<DMConversation> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required to start help conversation');
    }

    console.log('🆘 [DM-API] Starting help conversation');

    const resp = await tryEndpoints<any>(
      `/api/dm/help/start`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [DM-API] Help conversation started');
      return resp.data.conversation;
    }

    throw new Error(resp.data.message || 'Failed to start help conversation');
  } catch (error: any) {
    console.error('💥 [DM-API] Error starting help conversation:', error);
    throw new Error(error.message || 'Failed to start help conversation');
  }
}

/**
 * Get user's inbox (list of conversations)
 * 
 * @param type - Type of conversations to fetch ('community' | 'help' | undefined for all)
 * @param page - Page number for pagination
 * @param limit - Number of conversations per page
 * @returns Promise with conversations list
 */
export async function getInbox(
  type?: 'community' | 'help',
  page: number = 1,
  limit: number = 20
): Promise<ConversationListResponse> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required to access inbox');
    }

    console.log('📬 [DM-API] Fetching inbox:', { type, page, limit });

    const params = new URLSearchParams();
    if (type) params.append('type', type);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const resp = await tryEndpoints<any>(
      `/api/dm/inbox?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [DM-API] Inbox fetched:', resp.data.conversations?.length || 0);
      return {
        conversations: resp.data.conversations || [],
        total: resp.data.total || 0,
        page: resp.data.page || 1,
        limit: resp.data.limit || 20,
        hasMore: resp.data.hasMore || false,
      };
    }

    throw new Error(resp.data.message || 'Failed to fetch inbox');
  } catch (error: any) {
    console.error('💥 [DM-API] Error fetching inbox:', error);
    throw new Error(error.message || 'Failed to fetch inbox');
  }
}

/**
 * Get messages for a specific conversation
 * 
 * @param conversationId - Conversation ID
 * @param page - Page number for pagination
 * @param limit - Number of messages per page
 * @returns Promise with messages list
 */
export async function getMessages(
  conversationId: string,
  page: number = 1,
  limit: number = 30
): Promise<MessagesListResponse> {
  try {
    const token = await getAccessToken();
    if (!token) {
      console.error('❌ [DM-API] No access token available');
      throw new Error('Authentication required to access messages');
    }

    console.log('💬 [DM-API] Fetching messages:', { conversationId, page, limit });
    console.log('🔑 [DM-API] Token length:', token.length, 'chars');

    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const resp = await tryEndpoints<any>(
      `/api/dm/${conversationId}/messages?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [DM-API] Messages fetched:', resp.data.messages?.length || 0);
      return {
        messages: resp.data.messages || [],
        conversation: resp.data.conversation,
        total: resp.data.total || 0,
        page: resp.data.page || 1,
        limit: resp.data.limit || 30,
        hasMore: resp.data.hasMore || false,
      };
    }

    // Handle different error statuses
    if (resp.status === 403) {
      console.error('🚫 [DM-API] Access forbidden - user not authorized for this conversation');
      console.error('   Response:', resp.data);
      throw new Error('You do not have permission to access this conversation');
    }

    if (resp.status === 401) {
      console.error('🔒 [DM-API] Authentication failed');
      throw new Error('Authentication failed - please login again');
    }

    throw new Error(resp.data.message || `Request failed with status ${resp.status}`);
  } catch (error: any) {
    console.error('💥 [DM-API] Error fetching messages:', error);
    throw new Error(error.message || 'Failed to fetch messages');
  }
}

/**
 * Send a message in a conversation
 * 
 * @param conversationId - Conversation ID
 * @param messageData - Message data (text and/or attachments)
 * @returns Promise with sent message
 */
export async function sendMessage(
  conversationId: string,
  messageData: SendMessageData
): Promise<DMMessage> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required to send message');
    }

    if (!messageData.text && (!messageData.attachments || messageData.attachments.length === 0)) {
      throw new Error('Message must contain text or attachments');
    }

    console.log('📤 [DM-API] Sending message:', { conversationId, hasText: !!messageData.text, attachmentCount: messageData.attachments?.length || 0 });

    const resp = await tryEndpoints<any>(
      `/api/dm/${conversationId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: messageData,
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [DM-API] Message sent successfully');
      return resp.data.message;
    }

    throw new Error(resp.data.message || 'Failed to send message');
  } catch (error: any) {
    console.error('💥 [DM-API] Error sending message:', error);
    throw new Error(error.message || 'Failed to send message');
  }
}

/**
 * Upload and send an attachment in a conversation
 * 
 * @param conversationId - Conversation ID
 * @param file - File to upload
 * @returns Promise with sent message containing attachment
 */
export async function uploadAttachment(
  conversationId: string,
  file: any // React Native file object
): Promise<DMMessage> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required to upload attachment');
    }

    console.log('📎 [DM-API] Uploading attachment:', { conversationId, fileName: file.name });

    const formData = new FormData();
    formData.append('file', file);

    const resp = await tryEndpoints<any>(
      `/api/dm/${conversationId}/attachments`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        data: formData,
        timeout: 60000, // Longer timeout for file uploads
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [DM-API] Attachment uploaded and sent');
      return resp.data.message;
    }

    throw new Error(resp.data.message || 'Failed to upload attachment');
  } catch (error: any) {
    console.error('💥 [DM-API] Error uploading attachment:', error);
    throw new Error(error.message || 'Failed to upload attachment');
  }
}

/**
 * Mark a conversation as read
 * 
 * @param conversationId - Conversation ID
 * @returns Promise with success status
 */
export async function markConversationRead(conversationId: string): Promise<{ success: boolean }> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required to mark as read');
    }

    console.log('👁️ [DM-API] Marking conversation as read:', conversationId);

    const resp = await tryEndpoints<any>(
      `/api/dm/${conversationId}/read`,
      {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [DM-API] Conversation marked as read');
      return { success: true };
    }

    throw new Error(resp.data.message || 'Failed to mark as read');
  } catch (error: any) {
    console.error('💥 [DM-API] Error marking as read:', error);
    throw new Error(error.message || 'Failed to mark as read');
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get conversation display name
 *
 * @param conversation - Conversation object
 * @param currentUserId - Current user ID
 * @returns Display name for the conversation
 */
export function getConversationDisplayName(conversation: DMConversation, currentUserId: string): string {
  if (conversation.type === 'HELP_DM') {
    // For help conversations, show admin name and role if assigned
    if (conversation.participantB) {
      const adminName = conversation.participantB.name || 'Support Agent';
      const adminRole = conversation.participantB.poste ? ` (${conversation.participantB.poste})` : '';
      return `${adminName}${adminRole}`;
    }
    return 'Support Team';
  }

  if (conversation.type === 'COMMUNITY_DM') {
    if (conversation.communityId) {
      return `${conversation.communityId.name} Support`;
    }

    // Fallback to other participant name
    const otherParticipant = conversation.participantA._id === currentUserId
      ? conversation.participantB
      : conversation.participantA;

    return otherParticipant?.name || 'Community Creator';
  }

  return 'Unknown Conversation';
}

/**
 * Get conversation avatar/image
 *
 * @param conversation - Conversation object
 * @param currentUserId - Current user ID
 * @returns Avatar URL for the conversation
 */
export function getConversationAvatar(conversation: DMConversation, currentUserId: string): string | undefined {
  if (conversation.type === 'HELP_DM') {
    // For help conversations, show admin avatar if assigned
    if (conversation.participantB) {
      return conversation.participantB.photo_profil || conversation.participantB.profile_picture;
    }
    return undefined; // Will use default support icon
  }

  if (conversation.type === 'COMMUNITY_DM') {
    if (conversation.communityId?.logo) {
      return conversation.communityId.logo;
    }

    // Fallback to other participant avatar
    const otherParticipant = conversation.participantA._id === currentUserId
      ? conversation.participantB
      : conversation.participantA;

    return otherParticipant?.profile_picture || otherParticipant?.photo_profil;
  }

  return undefined;
}

/**
 * Get unread count for current user
 * 
 * @param conversation - Conversation object
 * @param currentUserId - Current user ID
 * @returns Unread message count
 */
export function getUnreadCount(conversation: DMConversation, currentUserId: string): number {
  return conversation.participantA._id === currentUserId 
    ? conversation.unreadCountA 
    : conversation.unreadCountB;
}

/**
 * Check if message is from current user
 * 
 * @param message - Message object
 * @param currentUserId - Current user ID
 * @returns True if message is from current user
 */
export function isMyMessage(message: DMMessage, currentUserId: string): boolean {
  return message.senderId === currentUserId;
}

/**
 * Format message time display
 * 
 * @param dateString - ISO date string
 * @returns Formatted time string
 */
export function formatMessageTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Format last message preview
 * 
 * @param message - Last message text
 * @param maxLength - Maximum length for preview
 * @returns Formatted preview text
 */
export function formatMessagePreview(message: string, maxLength: number = 50): string {
  if (!message) return 'No messages yet';
  
  if (message.length <= maxLength) return message;
  
  return message.substring(0, maxLength - 3) + '...';
}

/**
 * Get admin information for help conversation
 *
 * @param conversationId - Conversation ID
 * @returns Promise with admin details
 */
export async function getHelpConversationAdmin(conversationId: string): Promise<ConversationParticipant | null> {
  try {
    const token = await getAccessToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    console.log('👤 [DM-API] Getting help conversation admin:', conversationId);

    const resp = await tryEndpoints<any>(
      `/api/dm/${conversationId}/admin`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    if (resp.status >= 200 && resp.status < 300) {
      console.log('✅ [DM-API] Admin info fetched');
      return resp.data.admin;
    }

    throw new Error(resp.data.message || 'Failed to get admin info');
  } catch (error: any) {
    console.error('💥 [DM-API] Error getting admin info:', error);
    return null;
  }
}

/**
 * Get sender display name for message
 *
 * @param message - Message object
 * @param currentUserId - Current user ID
 * @param conversation - Conversation object
 * @returns Sender display name
 */
export function getSenderDisplayName(
  message: DMMessage, 
  currentUserId: string, 
  conversation: DMConversation | null
): string {
  if (isMyMessage(message, currentUserId)) {
    return 'You';
  }

  if (conversation?.type === 'HELP_DM' && conversation.participantB?._id === message.senderId) {
    // Admin message
    const adminName = conversation.participantB.name || 'Support Agent';
    return adminName;
  }

  // Default fallback
  return 'Support Agent';
}
