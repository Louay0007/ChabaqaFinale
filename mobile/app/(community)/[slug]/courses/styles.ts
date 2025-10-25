import { StyleSheet } from 'react-native';
import { borderRadius, colors, fontSize, fontWeight, spacing } from '../../../../lib/design-tokens';

export const styles = StyleSheet.create({
  // ===== STYLES COMMUNS =====
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  header: {
    backgroundColor: colors.coursesPrimary,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    position: 'relative',
    overflow: 'hidden',
  },
  tabsContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.gray100,
  },
  activeTab: {
    backgroundColor: colors.coursesPrimary,
  },
  tabText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.gray500,
  },
  activeTabText: {
    color: colors.white,
  },
  progressBar: {
    height: 4,
    backgroundColor: colors.gray200,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.coursesPrimary,
    borderRadius: 2,
  },

  // ===== STYLES SPÉCIFIQUES À LA LISTE =====
  backgroundCircle1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 80,
    height: 80,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  backgroundCircle2: {
    position: 'absolute',
    bottom: -30,
    left: -30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleSection: {
    flex: 0.6,
    marginRight: spacing.lg,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    flexWrap: 'nowrap',
  },
  title: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.white,
    marginLeft: 6,
    flexShrink: 0,
  },
  subtitle: {
    fontSize: fontSize.xs,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 0.4,
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    width: 42,
    marginBottom: spacing.xs,
  },
  statNumber: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.white,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 8,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 10,
    flexWrap: 'wrap',
  },
  searchContainer: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.gray800,
    padding: 0,
  },
  courseList: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },
  courseCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xl,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  courseImage: {
    width: '100%',
    height: 160,
    resizeMode: 'cover',
  },
  courseBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
  },
  enrolledBadge: {
    backgroundColor: colors.success,
  },
  freeBadge: {
    backgroundColor: colors.success,
  },
  priceBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  badgeText: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    marginLeft: spacing.xs,
  },
  courseContent: {
    padding: spacing.lg,
  },
  courseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  courseTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.gray800,
    flex: 1,
    marginRight: spacing.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: fontSize.xs,
    color: colors.gray500,
    marginLeft: spacing.xs,
  },
  courseDescription: {
    fontSize: fontSize.sm,
    color: colors.gray500,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  courseStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.md,
  },
  courseStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
    marginBottom: spacing.xs,
  },
  statText: {
    fontSize: fontSize.xs,
    color: colors.gray500,
    marginLeft: spacing.xs,
  },
  levelBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.gray100,
  },
  levelText: {
    fontSize: fontSize.xs,
    color: colors.gray500,
  },
  progressContainer: {
    marginBottom: spacing.md,
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressText: {
    fontSize: fontSize.xs,
    color: colors.gray500,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  creatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  creatorAvatar: {
    width: 24,
    height: 24,
    borderRadius: borderRadius.lg,
  },
  creatorName: {
    fontSize: fontSize.xs,
    color: colors.gray500,
    marginLeft: spacing.sm,
  },
  actionButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.lg,
  },
  enrollButton: {
    backgroundColor: colors.gray100,
  },
  continueButton: {
    backgroundColor: colors.coursesPrimary,
  },
  actionButtonText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  enrollButtonText: {
    color: colors.gray600,
  },
  continueButtonText: {
    color: colors.white,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyStateTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.gray600,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyStateText: {
    fontSize: fontSize.sm,
    color: colors.gray500,
    textAlign: 'center',
  },

  // ===== STYLES SPÉCIFIQUES AU DÉTAIL =====
  errorText: {
    textAlign: 'center',
    fontSize: fontSize.lg,
    marginTop: spacing.xl,
    color: colors.error,
  },
  courseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  detailHeader: {
    backgroundColor: colors.coursesPrimary,
    padding: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailProgressBarContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    marginTop: -4,
  },
  detailProgressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  detailProgressFill: {
    height: '100%',
    backgroundColor: colors.success,
    borderRadius: 2,
  },
  detailCourseTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  backButton: {
    marginRight: spacing.md,
  },
  infoText: {
    fontSize: fontSize.xs,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  infoSeparator: {
    fontSize: fontSize.xs,
    color: 'rgba(255, 255, 255, 0.8)',
    marginHorizontal: 6,
  },
  progressBarContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    marginTop: -4,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  videoContainer: {
    marginBottom: spacing.lg,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  videoPreview: {
    width: '100%',
    aspectRatio: 16 / 9,
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  playButtonOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  videoPlaceholder: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.gray800,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderContent: {
    alignItems: 'center',
    padding: spacing.xl,
  },
  placeholderTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.white,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  placeholderText: {
    fontSize: fontSize.sm,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  tabContent: {
    marginBottom: spacing.xxl,
  },
  chapterCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  chapterHeader: {
    marginBottom: spacing.md,
  },
  chapterTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.gray800,
    marginBottom: spacing.xs,
  },
  chapterNumber: {
    fontSize: fontSize.xs,
    color: colors.gray500,
  },
  chapterContent: {
    fontSize: fontSize.sm,
    color: colors.gray600,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.gray800,
    marginBottom: spacing.sm,
  },
  learningPoints: {
    marginBottom: spacing.lg,
  },
  learningPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  learningPointText: {
    fontSize: fontSize.sm,
    color: colors.gray600,
    marginLeft: spacing.sm,
    flex: 1,
  },
  exerciseText: {
    fontSize: fontSize.sm,
    color: colors.gray600,
    lineHeight: 20,
  },
  noteCard: {
    marginBottom: spacing.md,
  },
  noteCardYellow: {
    backgroundColor: '#fef3c7',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  noteCardBlue: {
    backgroundColor: '#e0f2fe',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  noteHeader: {
    flex: 1,
  },
  noteText: {
    fontSize: fontSize.sm,
    color: colors.gray600,
    marginBottom: spacing.xs,
  },
  noteTime: {
    fontSize: fontSize.xs,
    color: colors.gray500,
  },
  noteEditButton: {
    marginLeft: spacing.sm,
  },
  noteEditText: {
    fontSize: fontSize.xs,
    color: colors.coursesPrimary,
    fontWeight: fontWeight.medium,
  },
  resourceCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  resourceHeader: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  resourceTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.gray800,
    marginBottom: spacing.xs,
  },
  resourceDescription: {
    fontSize: fontSize.xs,
    color: colors.gray500,
  },
  resourceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  resourceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  resourceDetails: {
    marginLeft: spacing.md,
  },
  resourceName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.gray800,
  },
  resourceMeta: {
    fontSize: fontSize.xs,
    color: colors.gray500,
  },
  resourceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.gray100,
  },
  resourceButtonText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.gray600,
    marginLeft: spacing.xs,
  },
  discussionCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  discussionHeader: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  discussionTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.gray800,
    marginBottom: spacing.xs,
  },
  discussionDescription: {
    fontSize: fontSize.xs,
    color: colors.gray500,
  },
  commentContainer: {
    flexDirection: 'row',
    padding: spacing.lg,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.gray500,
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  commentText: {
    fontSize: fontSize.sm,
    color: colors.gray600,
    lineHeight: 20,
  },
  commentMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.xs,
  },
  commentAuthor: {
    fontSize: fontSize.xs,
    color: colors.gray500,
  },
  commentActions: {
    flexDirection: 'row',
  },
  commentAction: {
    marginLeft: spacing.md,
  },
  commentActionText: {
    fontSize: fontSize.xs,
    color: colors.gray500,
    fontWeight: fontWeight.medium,
  },
  sidebarCards: {
    gap: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  cardTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.gray800,
  },
  cardContent: {
    padding: spacing.lg,
  },
  progressCenter: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  progressPercentage: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.coursesPrimary,
  },
  progressLabel: {
    fontSize: fontSize.xs,
    color: colors.gray500,
  },
  progressBarFull: {
    height: 6,
    backgroundColor: colors.gray200,
    borderRadius: 3,
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  progressFillFull: {
    height: '100%',
    backgroundColor: colors.coursesPrimary,
    borderRadius: 3,
  },
  progressStats: {
    fontSize: fontSize.xs,
    color: colors.gray500,
    textAlign: 'center',
  },
  chapterList: {
    maxHeight: 300,
  },
  sectionItem: {
    marginBottom: spacing.lg,
  },
  sectionItemTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.gray800,
    marginBottom: spacing.sm,
  },
  chapterItems: {
    marginLeft: spacing.sm,
  },
  chapterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
  },
  chapterItemActive: {
    backgroundColor: colors.coursesBackground,
  },
  chapterItemDisabled: {
    opacity: 0.5,
  },
  chapterItemIcon: {
    marginRight: spacing.sm,
  },
  chapterItemContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chapterItemTitle: {
    fontSize: fontSize.xs,
    color: colors.gray600,
    flex: 1,
  },
  chapterItemDuration: {
    fontSize: fontSize.xs,
    color: colors.gray500,
    marginLeft: spacing.xs,
  },
  instructorContainer: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  instructorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.md,
  },
  instructorInfo: {
    flex: 1,
  },
  instructorName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.gray800,
    marginBottom: 2,
  },
  instructorRole: {
    fontSize: fontSize.xs,
    color: colors.gray500,
    marginBottom: spacing.xs,
  },
  instructorRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  instructorRatingText: {
    fontSize: fontSize.xs,
    color: colors.gray500,
    marginLeft: spacing.xs,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.md,
  },
  messageButtonText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.coursesPrimary,
    marginLeft: spacing.xs,
  },
});
