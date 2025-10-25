/**
 * Analytics Service
 * Handles all creator analytics API calls
 */

import { httpClient } from "./http-client"
import type {
  AnalyticsOverview,
  CommunitiesAnalytics,
  CoursesAnalytics,
  ChallengesAnalytics,
  SessionsAnalytics,
  EventsAnalytics,
  ProductsAnalytics,
  PostsAnalytics,
  DevicesAnalytics,
  ReferrersAnalytics,
  AnalyticsDateRange,
  ExportCsvParams,
} from "../types/analytics.types"

class AnalyticsService {
  private static instance: AnalyticsService

  static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService()
    }
    return AnalyticsService.instance
  }

  /**
   * Get overview analytics
   * GET /analytics/creator/overview
   */
  async getOverview(params?: AnalyticsDateRange): Promise<AnalyticsOverview> {
    const response = await httpClient.get<any>("/api/analytics/creator/overview", params)
    return response.data || response
  }

  /**
   * Get communities analytics
   * GET /analytics/creator/communities
   */
  async getCommunities(params?: AnalyticsDateRange): Promise<CommunitiesAnalytics> {
    const response = await httpClient.get<any>("/api/analytics/creator/communities", params)
    return response.data || response
  }

  /**
   * Get courses analytics
   * GET /analytics/creator/courses
   */
  async getCourses(params?: AnalyticsDateRange): Promise<CoursesAnalytics> {
    const response = await httpClient.get<any>("/api/analytics/creator/courses", params)
    return response.data || response
  }

  /**
   * Get challenges analytics
   * GET /analytics/creator/challenges
   */
  async getChallenges(params?: AnalyticsDateRange): Promise<ChallengesAnalytics> {
    const response = await httpClient.get<any>("/api/analytics/creator/challenges", params)
    return response.data || response
  }

  /**
   * Get sessions analytics
   * GET /analytics/creator/sessions
   */
  async getSessions(params?: AnalyticsDateRange): Promise<SessionsAnalytics> {
    const response = await httpClient.get<any>("/api/analytics/creator/sessions", params)
    return response.data || response
  }

  /**
   * Get events analytics
   * GET /analytics/creator/events
   */
  async getEvents(params?: AnalyticsDateRange): Promise<EventsAnalytics> {
    const response = await httpClient.get<any>("/api/analytics/creator/events", params)
    return response.data || response
  }

  /**
   * Get products analytics
   * GET /analytics/creator/products
   */
  async getProducts(params?: AnalyticsDateRange): Promise<ProductsAnalytics> {
    const response = await httpClient.get<any>("/api/analytics/creator/products", params)
    return response.data || response
  }

  /**
   * Get posts analytics
   * GET /analytics/creator/posts
   */
  async getPosts(params?: AnalyticsDateRange): Promise<PostsAnalytics> {
    const response = await httpClient.get<any>("/api/analytics/creator/posts", params)
    return response.data || response
  }

  /**
   * Get devices analytics
   * GET /analytics/creator/devices
   */
  async getDevices(params?: AnalyticsDateRange): Promise<DevicesAnalytics> {
    const response = await httpClient.get<any>("/api/analytics/creator/devices", params)
    return response.data || response
  }

  /**
   * Get referrers analytics
   * GET /analytics/creator/referrers
   */
  async getReferrers(params?: AnalyticsDateRange): Promise<ReferrersAnalytics> {
    const response = await httpClient.get<any>("/api/analytics/creator/referrers", params)
    return response.data || response
  }

  /**
   * Export analytics data as CSV
   * GET /analytics/creator/export
   */
  async exportCsv(params: ExportCsvParams): Promise<Blob> {
    const response = await httpClient.get<any>("/api/analytics/creator/export", params)
    // Assuming the response is CSV text, convert to Blob
    const csvData = response.data || response
    return new Blob([csvData], { type: 'text/csv' })
  }
}

export const analyticsService = AnalyticsService.getInstance()
