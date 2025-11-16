// Common types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// User types
export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  bio?: string;
  role: 'admin' | 'creator' | 'member';
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

// Community types
export interface Community {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  category: string;
  tags: string[];
  image?: string;
  coverImage?: string;
  price: number;
  priceType: 'free' | 'monthly' | 'yearly' | 'one-time';
  members: number;
  rating: number;
  verified: boolean;
  featured: boolean;
  creator: {
    id: string;
    name: string;
    avatar?: string;
    verified: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CommunitySettings {
  id: string;
  communityId: string;
  allowMemberPosts: boolean;
  requireApproval: boolean;
  allowInvites: boolean;
  visibility: 'public' | 'private' | 'hidden';
  updatedAt: string;
}

export interface CommunityMember {
  id: string;
  userId: string;
  communityId: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: string;
  user: User;
}

export interface CommunityFilters {
  category?: string;
  priceType?: string;
  featured?: boolean;
  verified?: boolean;
  minMembers?: number;
  sortBy?: 'popular' | 'newest' | 'members' | 'rating';
}

// Course types
export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  communityId: string;
  creatorId: string;
  thumbnail?: string;
  price: number;
  priceType: 'free' | 'paid';
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  isPublished: boolean;
  enrollmentCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface CourseSection {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  order: number;
  createdAt: string;
}

export interface CourseChapter {
  id: string;
  sectionId: string;
  title: string;
  content: string;
  videoUrl?: string;
  duration: number;
  order: number;
  isFree: boolean;
  createdAt: string;
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  progress: number;
  completedChapters: string[];
  enrolledAt: string;
  lastAccessedAt: string;
}

// Challenge types
export interface Challenge {
  id: string;
  title: string;
  slug: string;
  description: string;
  communityId: string;
  creatorId: string;
  thumbnail?: string;
  startDate: string;
  endDate: string;
  prize?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  isActive: boolean;
  participantCount: number;
  createdAt: string;
}

export interface ChallengeTask {
  id: string;
  challengeId: string;
  title: string;
  description: string;
  points: number;
  order: number;
  createdAt: string;
}

export interface ChallengeParticipant {
  id: string;
  userId: string;
  challengeId: string;
  score: number;
  completedTasks: string[];
  joinedAt: string;
  user: User;
}

// Session types
export interface Session {
  id: string;
  title: string;
  description: string;
  communityId: string;
  creatorId: string;
  duration: number; // in minutes
  price: number;
  availableSlots: number;
  bookedSlots: number;
  isActive: boolean;
  createdAt: string;
}

export interface SessionBooking {
  id: string;
  userId: string;
  sessionId: string;
  scheduledAt: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  meetingLink?: string;
  notes?: string;
  createdAt: string;
}

// Event types
export interface Event {
  id: string;
  title: string;
  slug: string;
  description: string;
  communityId?: string;
  thumbnail?: string;
  startDate: string;
  endDate: string;
  location?: string;
  isVirtual: boolean;
  maxAttendees?: number;
  currentAttendees: number;
  price: number;
  isPublished: boolean;
  createdAt: string;
}

export interface EventTicket {
  id: string;
  eventId: string;
  name: string;
  price: number;
  quantity: number;
  sold: number;
  description?: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  communityId: string;
  creatorId: string;
  thumbnail?: string;
  price: number;
  type: 'digital' | 'physical';
  isPublished: boolean;
  salesCount: number;
  rating: number;
  createdAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  price: number;
  stock?: number;
}

export interface ProductFile {
  id: string;
  productId: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

// Post types
export interface Post {
  id: string;
  title: string;
  content: string;
  communityId: string;
  authorId: string;
  thumbnail?: string;
  isPublished: boolean;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  updatedAt: string;
  author: User;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  createdAt: string;
  user: User;
}

// Payment types
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret: string;
}

export interface Subscription {
  id: string;
  userId: string;
  communityId: string;
  status: 'active' | 'cancelled' | 'past_due';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

// Analytics types
export interface DashboardAnalytics {
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    growth: number;
  };
  members: {
    total: number;
    new: number;
    active: number;
  };
  engagement: {
    posts: number;
    comments: number;
    likes: number;
  };
}

export interface RevenueAnalytics {
  period: string;
  revenue: number;
  transactions: number;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  data?: any;
  createdAt: string;
}

// Storage types
export interface UploadedFile {
  id: string;
  url: string;
  name: string;
  size: number;
  type: string;
  createdAt: string;
}
