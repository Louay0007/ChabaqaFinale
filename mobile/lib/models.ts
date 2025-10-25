// Re-export Community type from mock-data for consistency
export { Community, User } from './mock-data';

// Additional model types can be added here in the future
export interface CommunityStats {
  total: number;
  totalMembers: number;
  avgRating: number;
  freeCount: number;
}

export interface SearchFilters {
  query: string;
  category: string;
  priceType: string;
  sortBy: string;
  quickFilters: string[];
}
