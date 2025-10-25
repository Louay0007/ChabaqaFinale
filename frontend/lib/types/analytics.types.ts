/**
 * Analytics Types
 * TypeScript interfaces for Creator Analytics API requests and responses
 */

export interface AnalyticsOverview {
  totals: {
    views: number
    starts: number
    completes: number
    likes: number
    shares: number
    downloads: number
    bookmarks: number
    watchTime: number
    ratingsCount: number
  }
  trend: Array<{
    date: string
    views: number
    starts: number
    completes: number
    watchTime: number
  }>
  topContents: Array<{
    contentType: string
    contentId: string
    views: number
    completes: number
  }>
}

export interface CommunitiesAnalytics {
  total: number
  active: number
  members: number
  averageRating: number
  categories: string[]
  communities: Array<{
    id: string
    name: string
    members: number
    rating: number
    category: string
    createdAt: string
  }>
}

export interface CoursesAnalytics {
  byCourse: Array<{
    contentId: string
    views: number
    starts: number
    completes: number
    watchTime: number
    ratingsCount: number
    completionRate: number
  }>
  chapterFunnel: Array<{
    contentId: string
    chapterId: string
    views: number
    starts: number
    completes: number
    completionRate: number
  }>
}

export interface ChallengesAnalytics {
  byChallenge: Array<{
    contentId: string
    views: number
    starts: number
    completes: number
    participants: number
    completionRate: number
  }>
  taskBreakdown: Array<{
    contentId: string
    taskId: string
    views: number
    completes: number
    completionRate: number
  }>
}

export interface SessionsAnalytics {
  bySession: Array<{
    contentId: string
    views: number
    bookings: number
    revenue: number
    averageRating: number
  }>
  bookingsOverTime: Array<{
    date: string
    bookings: number
    revenue: number
  }>
}

export interface EventsAnalytics {
  byEvent: Array<{
    contentId: string
    views: number
    registrations: number
    attendees: number
    revenue: number
  }>
  registrationsOverTime: Array<{
    date: string
    registrations: number
  }>
}

export interface ProductsAnalytics {
  byProduct: Array<{
    contentId: string
    views: number
    purchases: number
    revenue: number
    refunds: number
    averageRating: number
  }>
  salesOverTime: Array<{
    date: string
    purchases: number
    revenue: number
  }>
}

export interface PostsAnalytics {
  byPost: Array<{
    contentId: string
    views: number
    likes: number
    shares: number
    comments: number
    engagementRate: number
  }>
  topPosts: Array<{
    contentId: string
    title: string
    views: number
    engagement: number
  }>
}

export interface DevicesAnalytics {
  devices: Array<{
    device: string
    count: number
    percentage: number
  }>
}

export interface ReferrersAnalytics {
  referrers: Array<{
    source: string
    count: number
    percentage: number
  }>
}

export interface AnalyticsDateRange {
  from?: string
  to?: string
}

export interface ExportCsvParams {
  scope: 'overview' | 'courses' | 'challenges' | 'sessions' | 'events' | 'products' | 'posts'
  from?: string
  to?: string
}
