import { borderRadius, colors, fontSize, fontWeight, spacing } from '@/lib/design-tokens';
import { StyleSheet } from 'react-native';

export const communityStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  
  // Header styles
  header: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  
  headerTitle: {
    fontSize: fontSize.xxl + 4, // 28px
    fontWeight: fontWeight.bold,
    color: colors.gray900,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  
  headerSubtitle: {
    fontSize: fontSize.base,
    color: colors.gray500,
    lineHeight: 24,
    textAlign: 'center',
  },
  
  // Search styles
  searchContainer: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
  },
  
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.md + 2, // 10px
    paddingHorizontal: spacing.sm + 6, // 14px
    paddingVertical: spacing.md - 2, // 10px
    marginBottom: spacing.md,
    height: 44,
  },
  
  searchIcon: {
    marginRight: spacing.md,
  },
  
  searchInput: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.gray900,
    paddingVertical: 0,
    minHeight: 20,
  },
  
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md - 2, // 10px
    paddingHorizontal: spacing.md,
  },
  
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  
  filterButtonText: {
    fontSize: fontSize.sm,
    color: colors.gray500,
    marginLeft: spacing.sm,
    fontWeight: fontWeight.medium,
  },
  
  filterButtonTextActive: {
    color: colors.white,
  },

  // Category Pills styles
  categoryContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.sm - 2, // 6px
  },

  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.xl,
    paddingVertical: spacing.sm - 2, // 6px
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm - 2, // 6px
    borderWidth: 1,
    borderColor: colors.gray200,
    height: 32,
  },

  categoryPillActive: {
    backgroundColor: colors.gray600,
    borderColor: colors.gray600,
  },

  categoryPillText: {
    fontSize: fontSize.xs + 1, // 13px
    color: colors.gray500,
    fontWeight: fontWeight.medium,
  },

  categoryPillTextActive: {
    color: colors.white,
  },
  
  // Community list styles
  communitiesList: {
    flexGrow: 1,
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  
  communityCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  
  communityImage: {
    width: '100%',
    height: 200,
  },
  
  communityContent: {
    padding: spacing.lg,
  },
  
  communityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  
  communityInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  
  communityName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.gray900,
    marginBottom: spacing.xs,
  },
  
  communityCreator: {
    fontSize: fontSize.sm,
    color: colors.gray500,
    marginBottom: spacing.sm,
  },
  
  communityDescription: {
    fontSize: fontSize.sm,
    color: colors.gray600,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  
  communityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  
  communityStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  
  statText: {
    fontSize: fontSize.xs,
    color: colors.gray500,
  },
  
  priceContainer: {
    alignItems: 'flex-end',
  },
  
  price: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  
  priceType: {
    fontSize: fontSize.xs,
    color: colors.gray500,
  },
  
  freeLabel: {
    backgroundColor: colors.success,
    color: colors.white,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  
  // Tags styles
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  
  tag: {
    backgroundColor: colors.gray200,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  
  tagText: {
    fontSize: fontSize.xs,
    color: colors.gray500,
    fontWeight: fontWeight.medium,
  },
  
  // Badge styles
  verifiedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 6,
  },
  
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  
  featuredText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Empty state
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  
  emptyStateText: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 16,
  },
  
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#8e78fb',
  },
  
  // Loading state
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Community detail page styles
  detailContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  
  detailImage: {
    width: '100%',
    height: 250,
  },
  
  detailContent: {
    padding: 20,
  },
  
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 8,
  },
  
  detailCreator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  creatorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  
  creatorInfo: {
    flex: 1,
  },
  
  creatorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a202c',
  },
  
  creatorRole: {
    fontSize: 14,
    color: '#64748b',
  },
  
  detailDescription: {
    fontSize: 16,
    color: '#4a5568',
    lineHeight: 24,
    marginBottom: 20,
  },
  
  detailStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 20,
  },
  
  detailStatItem: {
    alignItems: 'center',
  },
  
  detailStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  
  detailStatLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  
  joinButton: {
    backgroundColor: '#8b5cf6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  
  joinButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // Grid view styles
  gridContainer: {
    paddingHorizontal: 10,
  },
  
  gridItem: {
    flex: 1,
    margin: 10,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  
  gridImage: {
    width: '100%',
    height: 120,
  },
  
  gridContent: {
    padding: 12,
  },
  
  gridName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a202c',
    marginBottom: 4,
  },
  
  gridCreator: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 8,
  },
  
  gridPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#8b5cf6',
  },

  // Top Navigation Bar styles
  topNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },

  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  menuButton: {
    padding: spacing.xs,
    marginRight: spacing.md,
  },

  logo: {
    width: 100,
    height: 28,
    resizeMode: 'contain',
  },

  navRight: {
    width: 40,
  },

  // Sidebar styles - Opens from LEFT
  sidebarOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
    flexDirection: 'row',
  },

  sidebarBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  sidebarContainer: {
    width: 280,
    backgroundColor: colors.white,
    paddingTop: 60,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },

  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xxl,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },

  sidebarLogo: {
    width: 80,
    height: 24,
    resizeMode: 'contain',
    marginRight: spacing.md,
  },

  sidebarMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
  },

  sidebarMenuIcon: {
    marginRight: spacing.md,
  },

  sidebarMenuText: {
    fontSize: fontSize.base,
    color: colors.gray900,
    fontWeight: fontWeight.medium,
  },

  // Community Card Styles
  cardTouchable: {
    flex: 1,
  },

  // List View Styles
  listCard: {
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
    borderRadius: borderRadius.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },

  listContainer: {
    flexDirection: 'column',
    height: 'auto',
  },

  listImageContainer: {
    width: '100%',
    height: 180,
    position: 'relative',
    padding: spacing.sm,
    overflow: 'hidden',
  },

  listImage: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.lg,
  },

  imageOverlay: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    bottom: spacing.sm,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(0,0,0,0.1)',
    opacity: 0,
  },

  listContent: {
    width: '100%',
    padding: spacing.lg,
    justifyContent: 'flex-start',
  },

  listContentTop: {
    width: '100%',
    marginBottom: spacing.md,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: spacing.sm - 2, // 6px
  },

  listTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.gray900,
    flex: 1,
    marginRight: spacing.sm,
    lineHeight: 22,
  },

  creatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  communityCardCreatorAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.primaryBorder,
  },

  creatorText: {
    fontSize: fontSize.xs,
    color: colors.gray500,
  },

  communityCardCreatorName: {
    fontWeight: fontWeight.semibold,
    color: colors.gray900,
  },

  listDescription: {
    fontSize: fontSize.sm,
    color: colors.gray600,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },

  communityCardTagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 8,
  },

  communityCardTag: {
    borderColor: '#8e78fb30',
    backgroundColor: '#8e78fb05',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  communityCardTagText: {
    color: '#8e78fb',
    fontSize: 10,
    fontWeight: '500',
  },

  listFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },

  communityCardStatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  communityCardStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
  },

  communityCardStatText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748b',
  },

  communityCardCtaButton: {
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.sm - 2, // 6px
    borderRadius: borderRadius.md,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  communityCardCtaButtonText: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },

  // Badge Styles
  priceBadgeContainer: {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
  },

  priceBadge: {
    paddingHorizontal: spacing.md - 2, // 10px
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  priceBadgeText: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },

  floatingActions: {
    position: 'absolute',
    top: spacing.md,
    left: spacing.md,
    gap: spacing.sm - 2, // 6px
  },

  actionButton: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: spacing.sm - 2, // 6px
    borderRadius: borderRadius.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  categoryBadgeContainer: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
  },

  categoryBadge: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: spacing.md - 2, // 10px
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  categoryBadgeText: {
    color: colors.gray900,
    fontSize: spacing.md - 2, // 10px
    fontWeight: fontWeight.semibold,
  },

  communityCardVerifiedBadge: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 2,
  },

  verifiedContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },

  verifiedText: {
    fontSize: 8,
    color: '#ffffff',
    fontWeight: '500',
  },

  typeBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },

  typeBadgeText: {
    fontSize: 9,
    textTransform: 'capitalize',
    fontWeight: '500',
  },

  // Grid View Styles for Community Card
  communityCardGridCard: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },

  gridImageContainer: {
    position: 'relative',
    aspectRatio: 16/9,
  },

  communityCardGridImage: {
    width: '100%',
    height: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  gridImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },

  gridPriceBadgeContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
  },

  communityCardGridContent: {
    padding: 12,
    gap: 8,
  },

  communityCardGridTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a202c',
    lineHeight: 18,
  },

  gridCreatorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  gridCreatorAvatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  gridCreatorText: {
    fontSize: 10,
    color: '#64748b',
  },

  gridStatsContainer: {
    flexDirection: 'row',
    gap: 6,
    flexWrap: 'wrap',
  },

  communityCardGridCtaButton: {
    width: '100%',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});

export default communityStyles;
