import { borderRadius, colors, fontSize, fontWeight, spacing } from '@/lib/design-tokens';
import { StyleSheet } from 'react-native';

export const modalStyles = StyleSheet.create({
  // Container styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    width: '90%',
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: colors.white,
  },

  // Header styles
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  modalTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.gray800,
  },
  closeButton: {
    padding: spacing.xs,
  },

  // Body styles
  modalBody: {
    padding: spacing.lg,
    maxHeight: '70%',
  },
  scrollContainer: {
    flex: 1,
  },

  // Footer styles
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },

  // Common button styles
  primaryButton: {
    backgroundColor: colors.coursesPrimary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  primaryButtonText: {
    color: colors.white,
    fontWeight: fontWeight.medium,
    fontSize: fontSize.base,
  },
  secondaryButton: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  secondaryButtonText: {
    color: colors.gray600,
    fontWeight: fontWeight.medium,
    fontSize: fontSize.base,
  },

  // List styles
  listItem: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  // Text styles
  sectionTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.gray600,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  descriptionText: {
    fontSize: fontSize.sm,
    color: colors.gray600,
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  
  // Menu styles
  menuContainer: {
    width: '85%',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  menuItemText: {
    marginLeft: spacing.sm,
    fontSize: fontSize.base,
    color: colors.gray600,
    fontWeight: fontWeight.medium,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: 2,
  },

  // Icon styles
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  // Status styles
  unreadIndicator: {
    backgroundColor: colors.coursesPrimary,
  },
  errorText: {
    color: colors.error,
  },
  successText: {
    color: colors.success,
  },

  // SideMenu specific styles
  sideMenuContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  sideMenuScrollView: {
    flex: 1,
  },
  profileSection: {
    padding: spacing.lg,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: spacing.md,
  },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  nameContainer: {
    flex: 1,
  },
  userName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.gray800,
  },
  userRole: {
    fontSize: fontSize.sm,
    color: colors.gray500,
    marginTop: 2,
  },
  profileArrow: {
    marginTop: spacing.md,
  },
  viewProfile: {
    color: colors.gray600,
    fontSize: fontSize.sm,
  },
  sideMenuDivider: {
    height: 1,
    backgroundColor: colors.gray200,
    marginVertical: spacing.sm,
  },
  sideMenuItems: {
    padding: spacing.sm,
  },
  sideMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
  },
  sideMenuIcon: {
    width: 36,
    alignItems: 'center',
    marginRight: spacing.md,
  },
  sideMenuLabel: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.gray800,
  },
  bottomItems: {
    padding: spacing.sm,
  },
  logoutText: {
    color: colors.error,
  },
  disabledMenuItem: {
    opacity: 0.5,
  },
  disabledText: {
    color: colors.gray400,
  },
  versionText: {
    fontSize: fontSize.xs,
    color: colors.gray400,
    textAlign: 'center',
    marginVertical: spacing.lg,
  },

  // SideMenuModal specific styles
  sideMenuModalContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  sideMenuOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
  },
  sideMenuModalContent: {
    height: '100%',
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 20,
  },
  sideMenuCloseButton: {
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 10,
    padding: spacing.sm,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.gray200,
  },

  // JoinCommunityModal specific styles
  joinCommunityName: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.gray800,
    marginBottom: spacing.lg,
  },
  joinCommunityBenefitsList: {
    marginBottom: spacing.lg,
  },
  joinCommunityBenefitItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  joinCommunityPricingInfo: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.gray800,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  joinCommunityPricingNote: {
    fontSize: fontSize.xs,
    color: colors.gray500,
    marginBottom: spacing.lg,
  },

  // NotificationModal specific styles
  notificationContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  notificationHeaderTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.semibold,
    color: colors.gray800,
  },
  notificationUnreadItem: {
    backgroundColor: colors.coursesPrimaryLight,
  },
  notificationTextContainer: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.gray800,
    marginBottom: spacing.xs,
  },
  notificationMessage: {
    fontSize: fontSize.sm,
    color: colors.gray500,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
  notificationTime: {
    fontSize: fontSize.xs,
    color: colors.gray400,
  },
  notificationUnreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: spacing.sm,
    marginTop: spacing.xs,
  },
  notificationFooter: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  notificationMarkAllReadButton: {
    backgroundColor: colors.gray100,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: spacing.sm,
    alignItems: 'center',
  },
  notificationMarkAllReadText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.gray700,
  },

  // SearchModal specific styles
  searchContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  searchBackButton: {
    padding: spacing.sm,
    marginRight: spacing.sm,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray100,
    borderRadius: borderRadius.lg,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.base,
    color: colors.gray800,
    paddingVertical: spacing.sm,
  },
  searchResultsContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  searchResultsList: {
    flex: 1,
  },
  searchStatusText: {
    fontSize: fontSize.base,
    color: colors.gray500,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  searchResultIcon: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  searchUserIcon: {
    backgroundColor: colors.coursesPrimary,
  },
  searchCourseIcon: {
    backgroundColor: colors.sessionsPrimary,
  },
  searchTagIcon: {
    backgroundColor: colors.success,
  },
  searchPostIcon: {
    backgroundColor: colors.warning,
  },
  searchResultContent: {
    flex: 1,
  },
  searchResultTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.gray800,
    marginBottom: 2,
  },
  searchResultSubtitle: {
    fontSize: fontSize.sm,
    color: colors.gray500,
  },
  searchRecentContainer: {
    flex: 1,
    padding: spacing.lg,
  },
  searchRecentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  searchRecentTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.gray800,
  },
  searchClearText: {
    fontSize: fontSize.sm,
    color: colors.coursesPrimary,
  },
  searchRecentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },
  searchRecentText: {
    fontSize: fontSize.base,
    color: colors.gray600,
    marginLeft: spacing.md,
  },
  searchNoRecentText: {
    fontSize: fontSize.base,
    color: colors.gray500,
    textAlign: 'center',
    marginTop: spacing.xxl,
  },

  // PostMenuOverlay specific styles
  postMenuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    borderRadius: 12,
  },
});
