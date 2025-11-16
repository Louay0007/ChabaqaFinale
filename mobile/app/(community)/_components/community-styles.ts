import { borderRadius, colors, fontSize, fontWeight, spacing } from '@/lib/design-tokens';
import { StyleSheet } from 'react-native';

export const communityStyles = StyleSheet.create({
  // Card containers partagés
  cardContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: colors.gray900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 3,
  },

  // Headers partagés
  sectionHeader: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.gray800,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: fontSize.sm,
    color: colors.gray500,
  },

  // Navigation et actions
  bottomBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    paddingBottom: spacing.sm,
  },
  bottomBar: {
    flexDirection: 'row',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  tabText: {
    fontSize: 9,
    fontWeight: fontWeight.medium,
    color: colors.gray500,
    textAlign: 'center',
  },
  activeTabText: {
    fontWeight: fontWeight.semibold,
  },

  // Avatar et membres
  avatarContainer: {
    position: 'relative',
    marginBottom: spacing.sm,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: colors.gray200,
  },
  avatarSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.gray200,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.success,
    borderWidth: 3,
    borderColor: colors.white,
  },

  // Posts et contenu
  postCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: colors.gray900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.gray800,
  },
  postMeta: {
    fontSize: fontSize.xs,
    color: colors.gray500,
    marginTop: 2,
  },
  postContent: {
    fontSize: fontSize.sm + 1,
    color: colors.gray800,
    lineHeight: 22,
    marginBottom: spacing.md,
  },
  
  // Tags
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  tag: {
    backgroundColor: colors.gray200,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  tagText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.gray600,
  },

  // Actions et boutons
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    marginRight: spacing.lg,
  },
  actionText: {
    marginLeft: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.gray500,
    fontWeight: fontWeight.medium,
  },
  
  // Boutons principaux
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },
  secondaryButton: {
    backgroundColor: colors.gray100,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: colors.gray700,
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
  },

  // Images
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.md,
    marginVertical: spacing.md,
  },

  // Layout helpers
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    justifyContent: 'space-between',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex1: {
    flex: 1,
  },

  // Scrolling containers
  horizontalScroll: {
    paddingRight: spacing.lg,
  },
  memberItem: {
    alignItems: 'center',
    marginRight: spacing.lg,
    width: 70,
  },
  memberName: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.gray600,
    textAlign: 'center',
    maxWidth: 70,
  },

  // Menu et overlay styles
  menuButton: {
    padding: spacing.xs,
    marginTop: 2,
  },
  iconButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.xl,
  },

  // Community list styles
  listContainer: {
    flex: 1,
    backgroundColor: colors.gray50,
    padding: spacing.lg,
  },
  pageTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.gray800,
    marginBottom: spacing.lg,
  },
  communityCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    shadowColor: colors.gray900,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  communityImage: {
    width: 100,
    height: 100,
  },
  communityInfo: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'space-between',
  },
  communityName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.gray800,
    marginBottom: spacing.xs,
  },
  communityDescription: {
    fontSize: fontSize.sm,
    color: colors.gray500,
    marginBottom: spacing.sm,
    lineHeight: 20,
  },
  communityMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberCount: {
    fontSize: fontSize.xs,
    color: colors.gray500,
  },
  communityCategory: {
    fontSize: fontSize.xs,
    backgroundColor: colors.gray200,
    color: colors.gray600,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
});

// Couleurs spécifiques pour chaque section
export const sectionColors = {
  courses: {
    primary: colors.coursesPrimary,
    background: colors.coursesBackground,
    activeContainer: colors.coursesActiveBackground,
  },
  challenges: {
    primary: colors.challengesPrimary,
    background: colors.challengesBackground,
    activeContainer: colors.challengesActiveBackground,
  },
  sessions: {
    primary: colors.sessionsPrimary,
    background: colors.sessionsBackground,
    activeContainer: colors.sessionsActiveBackground,
  },
  products: {
    primary: colors.productsPrimary,
    background: colors.productsBackground,
    activeContainer: colors.productsActiveBackground,
  },
  events: {
    primary: colors.eventsPrimary,
    background: colors.eventsBackground,
    activeContainer: colors.eventsActiveBackground,
  },
};
