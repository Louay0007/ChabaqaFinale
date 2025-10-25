import { StyleSheet } from 'react-native';
import { borderRadius, colors, fontSize, fontWeight, spacing } from '../../lib/design-tokens';

// Styles de base communs à tous les écrans d'authentification
const baseStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: spacing.xl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  logo: {
    width: 280,
    height: 112,
  },
  logoLine: {
    width: 64,
    height: 4,
    borderRadius: borderRadius.xs,
    marginTop: -8,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxxl,
  },
  iconContainer: {
    marginBottom: spacing.lg,
  },
  iconBackground: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shieldContainer: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.gray800,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: fontSize.base,
    color: colors.gray600,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  headerNote: {
    fontSize: fontSize.sm,
    color: colors.gray500,
    textAlign: 'center',
  },
  welcomeTitle: {
    fontSize: fontSize.xl,
    color: colors.gray700,
    fontWeight: fontWeight.light,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  welcomeSubtitle: {
    fontSize: fontSize.sm,
    color: colors.gray500,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.authCardBackground,
    borderRadius: borderRadius.xxl,
    padding: spacing.xxxl,
    borderWidth: 1,
    borderColor: colors.authCardBorder,
    marginBottom: spacing.xxxl,
  },
  form: {
    gap: spacing.xxl,
  },
  successMessage: {
    backgroundColor: colors.successBackground,
    borderWidth: 1,
    borderColor: colors.success,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  successText: {
    color: colors.successDark,
    fontSize: fontSize.sm,
    textAlign: 'center',
  },
  errorMessage: {
    backgroundColor: colors.errorBackground,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
  },
  errorText: {
    color: colors.errorDark,
    fontSize: fontSize.sm,
  },
  inputContainer: {
    gap: spacing.sm,
  },
  label: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.gray800,
  },
  input: {
    backgroundColor: colors.authInputBackground,
    borderWidth: 2,
    borderColor: colors.authInputBorder,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    fontSize: fontSize.base,
    color: colors.gray800,
  },
  codeInput: {
    textAlign: 'center',
    fontSize: fontSize.xxl,
    letterSpacing: 8,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordToggle: {
    position: 'absolute',
    right: spacing.lg,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
  passwordToggleText: {
    color: colors.gray500,
    fontSize: fontSize.xxl,
  },
  primaryButton: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 2,
    borderColor: colors.authInputBorder,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.gray700,
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
  },
  disabledButton: {
    opacity: 0.5,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  dividerText: {
    color: colors.gray500,
    fontSize: fontSize.xs,
    textTransform: 'uppercase',
  },
  backButton: {
    alignItems: 'center',
    padding: spacing.lg,
  },
  backButtonText: {
    color: colors.authLink,
    fontSize: fontSize.base,
    fontWeight: fontWeight.medium,
  },
  linksContainer: {
    alignItems: 'center',
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  linkText: {
    color: colors.authLink,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  signupText: {
    color: colors.gray700,
    fontSize: fontSize.sm,
  },
  signinText: {
    color: colors.gray700,
    fontSize: fontSize.sm,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: colors.gray500,
    fontSize: fontSize.xs,
  },
});

// Styles spécifiques pour signup (gap plus petit)
export const signupStyles = StyleSheet.create({
  ...baseStyles,
  form: {
    gap: spacing.xl, // Plus petit gap pour signup
  },
  primaryButton: {
    ...baseStyles.primaryButton,
    marginTop: spacing.sm, // Margin supplémentaire pour signup
  },
  logoLine: {
    ...baseStyles.logoLine,
    marginTop: -4, // Différent pour signup
  },
  // Supprimer linksContainer gap pour signup
  linksContainer: {
    ...baseStyles.linksContainer,
    gap: 0,
  },
});

export default baseStyles;
