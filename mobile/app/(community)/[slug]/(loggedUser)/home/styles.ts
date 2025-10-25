import { StyleSheet } from 'react-native';
import { borderRadius, colors, fontSize, fontWeight, spacing } from '../../../../../lib/design-tokens';

// Styles optimisés pour la page d'accueil de la communauté
export const styles = StyleSheet.create({
  // ==========================================
  // CONTAINERS PRINCIPAUX
  // ==========================================
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  scrollContainer: {
    flex: 1,
    marginBottom: 80, // Espace pour la bottom navigation
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  errorText: {
    fontSize: fontSize.base,
    color: colors.error,
    textAlign: 'center',
  },

  // ==========================================
  // LAYOUTS RESPONSIVE
  // ==========================================
  mobileContent: {
    flexDirection: 'column',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  desktopContent: {
    flexDirection: 'row',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  mainContent: {
    flex: 2,
    flexDirection: 'column',
  },
  sidebarContainer: {
    flex: 1,
  },

  // ==========================================
  // CREATE POST CARD
  // ==========================================
  createPostCard: {
    backgroundColor: colors.postBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 3,
  },
  createPostHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  profilePic: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: spacing.md,
    borderWidth: 2,
    borderColor: colors.postBorder,
  },
  inputWrapper: {
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    paddingTop: spacing.md,
    minHeight: 80,
    maxHeight: 150,
    backgroundColor: colors.inputBackground,
    textAlignVertical: 'top',
    fontSize: fontSize.base,
    color: colors.gray800,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
    marginRight: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.actionButtonBackground,
  },
  actionButtonText: {
    marginLeft: 4,
    fontSize: fontSize.xs,
    color: colors.gray500,
  },
  postButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 1,
    marginLeft: spacing.sm,
  },
  postButtonText: {
    color: colors.white,
    fontWeight: fontWeight.semibold,
    fontSize: fontSize.sm,
  },
  postButtonDisabled: {
    backgroundColor: colors.gray300,
  },

  // ==========================================
  // POST CARDS (pour référence future)
  // ==========================================
  postsList: {
    marginBottom: spacing.lg,
  },
  postCard: {
    backgroundColor: colors.postBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  posterInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  posterName: {
    fontSize: fontSize.base,
    fontWeight: fontWeight.semibold,
    color: colors.gray800,
  },
  posterMeta: {
    fontSize: fontSize.xs,
    color: colors.gray500,
  },
  postContent: {
    fontSize: fontSize.sm,
    color: colors.gray800,
    lineHeight: 20,
    marginBottom: spacing.md,
  },
  postImage: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.md,
    marginVertical: spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
    marginBottom: spacing.md,
  },
  tag: {
    backgroundColor: colors.tagBackground,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.xs,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  tagText: {
    fontSize: fontSize.xs,
    color: colors.gray600,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.postActionBorder,
  },
  postActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.xs,
  },
  postActionText: {
    marginLeft: spacing.xs,
    fontSize: fontSize.xs,
    color: colors.gray500,
  },
  bookmarkButton: {
    padding: spacing.xs,
  },
});