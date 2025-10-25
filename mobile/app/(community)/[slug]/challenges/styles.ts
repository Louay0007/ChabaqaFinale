import { StyleSheet } from 'react-native';
import { borderRadius, colors, fontSize, fontWeight, spacing } from '../../../../lib/design-tokens';

export const styles = StyleSheet.create({
  // ===== STYLES COMMUNS =====
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  header: {
    backgroundColor: colors.challengesPrimary,
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
  title: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.white,
    marginLeft: 6,
    flexShrink: 0,
  },
  subtitle: {
    fontSize: fontSize.xs,
    color: colors.challengesPrimaryLight,
    lineHeight: spacing.lg,
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
    color: colors.challengesPrimaryLight,
    textAlign: 'center',
    lineHeight: 10,
    flexWrap: 'wrap',
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
    backgroundColor: colors.actionButtonBackground,
  },
  activeTab: {
    backgroundColor: colors.challengesPrimary,
  },
  tabText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.gray500,
  },
  activeTabText: {
    color: colors.white,
  },

  // ===== STYLES POUR CHALLENGES LIST (index.tsx) =====
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.postBorder,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: colors.gray800,
  },
  filterButton: {
    width: 40,
    height: 40,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.postBorder,
  },
  challengesList: {
    padding: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: 100, // Espace pour la bottom navigation
  },
  challengeCard: {
    backgroundColor: colors.challengesCardBackground,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    backgroundColor: colors.challengesPrimary,
    padding: spacing.lg,
    position: 'relative',
  },
  // Note: statusBadge utilisé dans les deux contextes avec des positionnements différents
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  // Variante pour la liste avec positionnement absolu
  listStatusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.lg,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  statusText: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  cardDescription: {
    fontSize: fontSize.sm,
    color: colors.challengesPrimaryLight,
  },
  cardContent: {
    padding: spacing.lg,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardInfoText: {
    marginLeft: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.gray500,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.actionButtonBackground,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  difficultyText: {
    fontSize: fontSize.xs,
    color: colors.gray600,
  },
  pointsText: {
    fontSize: fontSize.xs,
    color: colors.warning,
    fontWeight: fontWeight.medium,
    marginLeft: spacing.xs,
  },
  actionButton: {
    padding: spacing.md,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.postBorder,
  },
  joinButton: {
    backgroundColor: colors.white,
  },
  continueButton: {
    backgroundColor: colors.challengesCompletedBackground,
  },
  actionButtonText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.challengesPrimary,
  },

  // ===== STYLES POUR CHALLENGE DETAIL ([challengeId]/index.tsx) =====
  scrollView: {
    flex: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    paddingBottom: 0,
  },
  backButtonText: {
    marginLeft: spacing.sm,
    fontSize: fontSize.sm,
    color: colors.gray600,
  },
  // Réutilisation du header avec des ajustements pour le détail
  detailTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    flexWrap: 'nowrap',
  },
  detailTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.bold,
    color: colors.white,
    marginLeft: spacing.sm,
    lineHeight: 20,
    flexShrink: 0,
  },
  detailSubtitle: {
    fontSize: 13,
    color: colors.challengesPrimaryLight,
    lineHeight: 18,
    marginBottom: spacing.xs,
  },
  tabContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 24,
  },
  currentTaskCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointsBadge: {
    backgroundColor: colors.challengesBackground,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.xl,
  },
  taskCardTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.gray800,
    marginBottom: spacing.sm,
  },
  taskCardDescription: {
    fontSize: fontSize.sm,
    color: colors.gray600,
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  instructionsContainer: {
    backgroundColor: colors.actionButtonBackground,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: spacing.lg,
  },
  instructionsTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.gray800,
    marginBottom: spacing.xs,
  },
  instructionsText: {
    fontSize: fontSize.sm,
    color: colors.gray600,
    lineHeight: 20,
  },
  resourcesAndInstructionsTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.gray800,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  actionsContainer: {
    flexDirection: 'row',
    marginTop: spacing.lg,
    justifyContent: 'space-between',
  },
  submitButton: {
    backgroundColor: colors.challengesPrimary,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    flex: 1,
    marginRight: spacing.sm,
  },
  submitButtonText: {
    color: colors.white,
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.sm,
  },
  helpButton: {
    backgroundColor: colors.actionButtonBackground,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.postBorder,
    width: 100,
  },
  helpButtonText: {
    color: colors.gray600,
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.sm,
  },
  taskResourcesContainer: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  taskResourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.actionButtonBackground,
  },
  resourceInfo: {
    flex: 1,
    marginHorizontal: 12,
  },
  resourceTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.gray800,
    marginBottom: 2,
  },
  resourceDescription: {
    fontSize: fontSize.xs,
    color: colors.gray500,
  },
  progressCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  progressContainer: {
    marginTop: spacing.md,
  },
  progressText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.challengesPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.actionButtonBackground,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.challengesPrimary,
    borderRadius: borderRadius.sm,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.actionButtonBackground,
  },
  infoLabel: {
    fontSize: fontSize.sm,
    color: colors.gray500,
  },
  infoValue: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.gray800,
  },
  notesContainer: {
    marginTop: spacing.md,
  },
  notesTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.gray800,
    marginBottom: spacing.xs,
  },
  notesText: {
    fontSize: fontSize.sm,
    color: colors.gray600,
    lineHeight: 20,
  },
  resourcesCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  resourceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.actionButtonBackground,
  },
  resourceText: {
    fontSize: fontSize.sm,
    color: colors.gray600,
    marginLeft: spacing.md,
  },
  timelineCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardSubtitle: {
    fontSize: fontSize.sm,
    color: colors.gray500,
    marginBottom: spacing.lg,
  },
  tasksList: {
    marginTop: spacing.sm,
  },
  taskItem: {
    backgroundColor: colors.gray50,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: colors.gray300,
  },
  completedTaskItem: {
    borderLeftColor: colors.success,
    backgroundColor: colors.challengesCompletedBackground,
  },
  activeTaskItem: {
    borderLeftColor: colors.challengesPrimary,
    backgroundColor: colors.challengesBackground,
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  taskDayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskDay: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.gray600,
    marginRight: spacing.sm,
  },
  taskPoints: {
    fontSize: fontSize.xs,
    color: colors.challengesPrimary,
  },
  taskStatus: {
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  taskStatusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  activeTaskIndicator: {
    backgroundColor: colors.challengesPrimary,
  },
  inactiveTaskIndicator: {
    backgroundColor: colors.gray300,
  },
  taskTitle: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
    color: colors.gray800,
    marginBottom: spacing.xs,
  },
  taskDescription: {
    fontSize: fontSize.sm,
    color: colors.gray500,
  },
  leaderboardCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leaderboardList: {
    marginTop: spacing.sm,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.gray50,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  currentUserLeaderboardItem: {
    backgroundColor: colors.challengesBackground,
    borderWidth: 1,
    borderColor: colors.challengesCurrentUserBorder,
  },
  leaderboardRank: {
    width: 32,
    alignItems: 'center',
  },
  rankText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.gray600,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: borderRadius.xl,
    marginRight: spacing.md,
  },
  leaderboardUserInfo: {
    flex: 1,
  },
  userName: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.gray800,
    marginBottom: spacing.xs,
  },
  userStats: {
    flexDirection: 'row',
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.actionButtonBackground,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  statBadgeText: {
    fontSize: fontSize.xs,
    color: colors.gray500,
    marginLeft: spacing.xs,
  },
  submissionsCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  submissionItem: {
    backgroundColor: colors.challengesCompletedBackground,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: colors.success,
  },
  submissionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  submissionTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.gray800,
  },
  submissionDate: {
    fontSize: fontSize.xs,
    color: colors.gray500,
    marginBottom: spacing.sm,
  },
  feedbackContainer: {
    backgroundColor: colors.white,
    padding: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  feedbackLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.gray800,
    marginBottom: 2,
  },
  feedbackText: {
    fontSize: fontSize.xs,
    color: colors.gray600,
  },

  // ===== STYLES COMMUNS =====
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: fontSize.sm,
    color: colors.gray500,
  },

  // ===== STYLES POUR CHALLENGE DETAIL INDEX ([challengeId]/index.tsx) =====
  challengeDetailContainer: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  challengeDetailScrollView: {
    flex: 1,
  },

  // ===== STYLES ADDITIONNELS POUR LES COMPOSANTS =====
  // Styles pour le header du challenge avec cercles de background
  challengeHeaderContainer: {
    backgroundColor: colors.challengesPrimary,
    borderRadius: borderRadius.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.xl,
    position: 'relative',
    overflow: 'hidden',
  },

  // Styles pour la navigation par onglets
  tabNavigationContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.lg,
  },
  tabScrollView: {
    flexGrow: 0,
  },

  // Styles pour les cartes de contenu des onglets
  tabContentContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 24,
  },

  // Styles pour les éléments interactifs
  touchableItem: {
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },

  // Styles pour les badges et indicateurs
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.lg,
    alignSelf: 'flex-start',
  },

  // Styles pour les listes et items
  listItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.postBorder,
  },

  // Styles pour les conteneurs de statistiques
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },

  // Styles pour les textes de différentes tailles
  headingText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.gray800,
  },
  bodyText: {
    fontSize: fontSize.sm,
    color: colors.gray600,
    lineHeight: 20,
  },
  captionText: {
    fontSize: fontSize.xs,
    color: colors.gray500,
  },

  // Styles pour les états de chargement
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  loadingText: {
    marginTop: spacing.md,
    fontSize: fontSize.sm,
    color: colors.gray500,
  },
});
