import { StyleSheet } from 'react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '@/lib/design-tokens';

export const enhancedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9ff',
  },

  // Header Styles
  headerWrapper: {
    position: 'relative',
    marginBottom: 0, // Removed margin
  },

  headerGradient: {
    paddingTop: spacing.lg, // Reduced from xxl
    paddingHorizontal: spacing.md, // Reduced from xl
    paddingBottom: 60, // Reduced from 80
    position: 'relative',
    overflow: 'hidden',
  },
  
  headerBackgroundImage: {
    width: '150%',
    height: '150%',
    resizeMode: 'stretch', // Fully stretch the image to fill the entire area
  },
  

  // Decorative Elements - Smaller and subtle
  decorativeCircle1: {
    position: 'absolute',
    width: 100, // Reduced from 150
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    top: -20, // Adjusted position
    right: -20,
  },

  decorativeCircle2: {
    position: 'absolute',
    width: 70, // Reduced from 100
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    bottom: 30, // Adjusted position
    left: -15,
  },

  decorativeCircle3: {
    position: 'absolute',
    width: 40, // Reduced from 60
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    top: 70, // Adjusted position
    left: 20,
  },

  settingsButton: {
    position: 'absolute',
    top: spacing.md, // Reduced from xl
    right: spacing.md, // Reduced from xl
    width: 36, // Reduced from 44
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // Reduced shadow
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },

  // Avatar Styles - Enhanced with better spacing
  avatarContainer: {
    alignItems: 'center',
    marginTop: spacing.xl, // Increased for better spacing from nav bar
    marginBottom: spacing.lg, // Increased for better spacing to user info
    position: 'relative',
    paddingHorizontal: spacing.md,
  },

  avatarGlow: {
    shadowColor: '#8e78fb',
    shadowOffset: { width: 0, height: 6 }, // Enhanced shadow
    shadowOpacity: 0.4,
    shadowRadius: 16, // Better glow effect
    elevation: 8,
    backgroundColor: 'transparent', // Ensure clean background
  },

  avatar: {
    width: 100, // Increased from 80 for better prominence
    height: 100,
    borderRadius: 50,
    borderWidth: 4, // Restored border thickness
    borderColor: 'rgba(255, 255, 255, 0.8)', // More visible border
  },

  avatarPlaceholder: {
    overflow: 'hidden',
  },

  avatarGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },

  editAvatarBadge: {
    position: 'absolute',
    bottom: 2, // Better positioning
    right: '32%', // Adjusted for larger avatar
    width: 32, // Slightly larger for better visibility
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff9b28',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3, // Restored border thickness
    borderColor: '#fff', // White border for better contrast
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // Enhanced shadow
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  // User Info - Enhanced with better spacing
  userName: {
    fontSize: 24, // Slightly increased for better hierarchy
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
    marginBottom: spacing.sm, // Better spacing
    marginTop: spacing.sm, // Add top margin for breathing room
    letterSpacing: 0.3,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    paddingHorizontal: spacing.md, // Add horizontal padding
  },

  roleBadge: {
    paddingHorizontal: spacing.lg, // Increased for better proportions
    paddingVertical: spacing.xs, // Better vertical padding
    backgroundColor: '#8e78fb',
    borderRadius: borderRadius.full,
    marginBottom: spacing.sm, // Better spacing
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // Enhanced shadow
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },

  roleText: {
    fontSize: fontSize.xs, // Reduced from sm
    fontWeight: fontWeight.semibold,
    color: '#fff',
    textTransform: 'capitalize',
  },

  userEmail: {
    fontSize: fontSize.base, // Restored for better readability
    color: '#4b5563',
    textAlign: 'center',
    marginBottom: spacing.lg, // Better spacing
    fontWeight: fontWeight.medium,
    paddingHorizontal: spacing.md, // Add horizontal padding
  },

  userBio: {
    fontSize: fontSize.sm,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 22, // Better line height
    paddingHorizontal: spacing.xl, // Better horizontal padding
    marginBottom: spacing.md, // Add bottom margin
    fontWeight: fontWeight.normal,
  },

  // Stats Container - Smaller
  statsContainer: {
    position: 'absolute',
    bottom: -40, // Reduced from -60
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md, // Reduced from xl
    zIndex: 10,
  },

  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm, // Reduced from md
  },

  statCardWrapper: {
    flex: 1,
  },

  statCard: {
    padding: spacing.md, // Reduced from lg
    borderRadius: borderRadius.md, // Reduced from lg
    alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: { width: 0, height: 3 }, // Reduced
    shadowOpacity: 0.2,
    shadowRadius: 8, // Reduced from 15
    elevation: 6,
    borderWidth: 1.5, // Reduced from 2
    borderColor: 'rgba(142, 120, 251, 0.3)',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },

  statIcon: {
    width: 36, // Reduced from 46
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm, // Reduced from md
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // Reduced
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1.5, // Reduced from 2
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },

  statValue: {
    fontSize: fontSize.lg, // Reduced from xl
    fontWeight: fontWeight.bold,
    color: '#1f2937',
    marginBottom: 2, // Reduced
  },

  statLabel: {
    fontSize: 10, // Reduced from xs
    fontWeight: fontWeight.medium, // Reduced from semibold
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.3, // Reduced
  },

  // Actions Container - Enhanced
  actionsContainer: {
    flexDirection: 'row',
    gap: spacing.md, // Better spacing between buttons
    paddingHorizontal: spacing.lg, // Better horizontal padding
    marginTop: 50, // Better top margin
    marginBottom: spacing.lg, // Better bottom margin
  },

  actionButtonPrimary: {
    flex: 2,
    borderRadius: borderRadius.lg, // Restored larger radius for premium look
    overflow: 'hidden',
    shadowColor: '#8e78fb',
    shadowOffset: { width: 0, height: 4 }, // Enhanced shadow
    shadowOpacity: 0.3,
    shadowRadius: 8, // Better shadow spread
    elevation: 6,
    transform: [{ scale: 1 }], // Prepare for potential animations
  },

  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm, // Better icon-text spacing
    paddingVertical: spacing.lg, // More comfortable padding
    paddingHorizontal: spacing.xl, // Better horizontal padding
    minHeight: 48, // Ensure minimum touch target
  },

  actionButtonPrimaryText: {
    fontSize: fontSize.base, // Restored for better readability
    fontWeight: fontWeight.bold, // Stronger weight for primary action
    color: '#fff',
    letterSpacing: 0.5, // Better letter spacing
  },

  actionButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm, // Better icon-text spacing
    paddingVertical: spacing.lg, // Match primary button padding
    paddingHorizontal: spacing.lg, // Better horizontal padding
    borderRadius: borderRadius.lg, // Match primary button radius
    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Slightly transparent for modern look
    borderWidth: 2, // Restored border thickness
    borderColor: '#8e78fb',
    shadowColor: '#8e78fb',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    minHeight: 48, // Match primary button height
  },

  actionButtonSecondaryText: {
    fontSize: fontSize.base, // Match primary button font size
    fontWeight: fontWeight.semibold,
    color: '#8e78fb',
    letterSpacing: 0.3, // Better letter spacing
  },

  // Bio Section Styles
  bioSection: {
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    backgroundColor: '#fff',
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#8e78fb',
  },

  bioTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: '#8e78fb',
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  bioText: {
    fontSize: fontSize.base,
    color: colors.gray700,
    lineHeight: 24,
    fontWeight: fontWeight.normal,
  },

  bioEmptyState: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },

  bioEmptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(142, 120, 251, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  bioEmptyText: {
    fontSize: fontSize.sm,
    color: colors.gray500,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },

  bioEmptySubtext: {
    fontSize: fontSize.xs,
    color: colors.gray400,
    textAlign: 'center',
  },

  // Tabs Styles
  tabsWrapper: {
    paddingHorizontal: spacing.xl,
    marginBottom: spacing.lg,
  },

  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0edff',
    borderRadius: borderRadius.lg,
    padding: 4,
  },

  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    position: 'relative',
    overflow: 'hidden',
  },

  tabActive: {
    // Active styles handled by gradient overlay
  },

  tabActiveGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: borderRadius.md,
  },

  tabText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.gray600,
    zIndex: 1,
  },

  tabTextActive: {
    color: '#fff',
    fontWeight: fontWeight.semibold,
  },

  // Tab Content
  tabContent: {
    flex: 1,
  },

  // About Section
  aboutSection: {
    padding: spacing.xl,
  },

  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.gray900,
    marginBottom: spacing.lg,
  },

  infoCard: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.xl,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray100,
  },

  infoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.lg,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.gray500,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  infoText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.gray900,
  },

  // Activity Section
  activitySection: {
    padding: spacing.xl,
  },

  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    backgroundColor: '#fff',
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },

  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },

  activityContent: {
    flex: 1,
  },

  activityTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.gray900,
    marginBottom: spacing.xs,
  },

  activityDescription: {
    fontSize: fontSize.sm,
    color: colors.gray600,
    marginBottom: spacing.xs,
    lineHeight: 20,
  },

  activityTime: {
    fontSize: fontSize.xs,
    color: colors.gray500,
    fontWeight: fontWeight.medium,
  },

  emptyStateCard: {
    backgroundColor: '#fff',
    borderRadius: borderRadius.xl,
    padding: spacing.xxxl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },

  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0edff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  emptyStateText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.gray900,
    marginBottom: spacing.sm,
  },

  emptyStateSubtext: {
    fontSize: fontSize.base,
    color: colors.gray500,
    textAlign: 'center',
  },

  // Loading & Empty States
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },

  emptyText: {
    fontSize: fontSize.base,
    color: colors.gray500,
    textAlign: 'center',
    marginTop: spacing.lg,
  },

  button: {
    backgroundColor: '#8e78fb',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
    shadowColor: '#8e78fb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  buttonText: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: '#fff',
    textAlign: 'center',
  },
});
