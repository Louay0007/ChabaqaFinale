import { StyleSheet } from 'react-native';
import { borderRadius, colors, fontSize, fontWeight, spacing } from '../../../../lib/design-tokens';

export const styles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1, 
    backgroundColor: colors.gray50, 
    paddingTop: 16,
  },

  // Events Header Styles
  header: {
    backgroundColor: colors.eventsPrimary,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundCircle1: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 80,
    height: 80,
    borderRadius: 40,
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
  icon: {
    fontSize: fontSize.xl,
    marginRight: 6,
  },
  title: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.white,
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

  // Search Bar Styles
  searchContainer: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
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

  // Tabs Styles
  tabsContainer: {
    marginBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
  },
  tab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    borderRadius: 20,
    backgroundColor: colors.gray100,
  },
  activeTab: {
    backgroundColor: colors.eventsPrimary,
  },
  tabText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.gray500,
  },
  activeTabText: {
    color: colors.white,
  },
  tabContent: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingBottom: 100,
  },

  // Available Events Tab Styles
  availableEventsContainer: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  separator: {
    height: 16,
  },

  // My Tickets Tab Styles
  ticketCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.lg,
  },
  ticketInfo: {
    flex: 1,
    marginRight: spacing.md,
  },
  eventTitle: {
    fontSize: 19,
    fontWeight: fontWeight.bold,
    marginBottom: 6,
    color: '#111827',
  },
  ticketName: {
    fontSize: 15,
    color: colors.gray600,
    fontWeight: fontWeight.medium,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  ticketDetails: {
    marginBottom: spacing.lg,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  detailText: {
    fontSize: 15,
    color: '#374151',
    flex: 1,
    lineHeight: 22,
    fontWeight: fontWeight.medium,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
  },
  joinButtonIcon: {
    fontSize: fontSize.base,
    marginRight: spacing.sm,
  },
  joinButtonText: {
    color: colors.white,
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.sm,
  },

  // Empty State Styles
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    marginBottom: 10,
    color: '#111827',
  },
  emptySubtitle: {
    fontSize: fontSize.base,
    color: colors.gray600,
    marginBottom: spacing.xxl,
    fontWeight: fontWeight.medium,
  },
  browseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.eventsPrimary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  browseButtonIcon: {
    fontSize: fontSize.base,
    color: colors.white,
    marginRight: spacing.sm,
  },
  browseButtonText: {
    color: colors.white,
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.sm,
  },

  // Calendar Tab Styles
  calendarContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  calendarContentContainer: {
    paddingBottom: 100,
  },
  calendarHeader: {
    paddingHorizontal: spacing.xl,
    paddingTop: 20,
    paddingBottom: 15,
  },
  calendarTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.gray800,
    marginBottom: 5,
  },
  calendarSubtitle: {
    fontSize: fontSize.base,
    color: colors.gray500,
  },
  calendarView: {
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: spacing.xl,
  },
  calendarMonthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  monthNavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarMonthText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.gray800,
  },
  weekdayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
  },
  weekdayText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.gray500,
    textAlign: 'center',
    width: 35,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  dayButton: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentDayButton: {
    backgroundColor: colors.eventsPrimary,
  },
  eventDayButton: {
    backgroundColor: '#e879f9',
  },
  calendarDayText: {
    fontSize: fontSize.sm,
    color: colors.gray800,
    fontWeight: fontWeight.medium,
  },
  currentDayText: {
    color: 'white',
    fontWeight: fontWeight.semibold,
  },
  eventDayText: {
    color: 'white',
    fontWeight: fontWeight.semibold,
  },
  eventIndicator: {
    width: 4,
    height: 4,
    backgroundColor: colors.eventsPrimary,
    borderRadius: 2,
    marginTop: 2,
  },
  upcomingEventsSection: {
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: spacing.xl,
  },
  upcomingEventsTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.gray800,
    marginBottom: 15,
  },
  upcomingEventItem: {
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  upcomingEventTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.gray800,
    marginBottom: spacing.xs,
  },
  upcomingEventDate: {
    fontSize: fontSize.sm,
    color: colors.eventsPrimary,
    fontWeight: fontWeight.medium,
    marginBottom: 2,
  },
  eventLocationText: {
    fontSize: 13,
    color: colors.gray500,
  },
  statsSection: {
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: spacing.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: spacing.xl,
  },
  statsSectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.gray800,
    marginBottom: 15,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  lastStatRow: {
    borderBottomWidth: 0,
  },
  statRowLabel: {
    fontSize: fontSize.sm,
    color: colors.gray500,
    fontWeight: fontWeight.medium,
  },
  statRowValue: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.gray800,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starIcon: {
    fontSize: fontSize.base,
  },
});
