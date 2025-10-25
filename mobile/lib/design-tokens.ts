// Design tokens - Seulement les constantes, pas les styles complets: 
// Contient : colors, spacing, fontSize, fontWeight, borderRadius
export const colors = {
  // Primary Color from Color Guide
  primary: '#8e78fb',
  primaryLight: 'rgba(142, 120, 251, 0.1)',
  primaryBorder: 'rgba(142, 120, 251, 0.2)',
  
  // Auth specific colors
  authLink: '#86e4fd',
  authCardBackground: 'rgba(255, 255, 255, 0.25)',
  authCardBorder: 'rgba(255, 255, 255, 0.4)',
  authInputBackground: 'rgba(255, 255, 255, 0.7)',
  authInputBorder: 'rgba(255, 255, 255, 0.5)',
  
  // Community Home specific colors
  postBackground: '#ffffff',
  postBorder: '#e5e7eb',
  inputBackground: '#f9fafb',
  inputBorder: '#e5e7eb',
  actionButtonBackground: '#f3f4f6',
  tagBackground: '#e5e7eb',
  postActionBorder: '#f3f4f6',
  
  // Community Challenges specific colors (Orange from Color Guide)
  challengesPrimary: '#ff9b28',
  challengesPrimaryLight: '#ffedd5',
  challengesBackground: '#fff7ed',
  challengesCardBackground: '#ffffff',
  challengesActiveBackground: '#fff7ed',
  challengesCompletedBackground: '#ecfdf5',
  challengesStatusBackground: 'rgba(0,0,0,0.1)',
  challengesProgressBackground: '#f3f4f6',
  challengesLeaderboardBackground: '#f9fafb',
  challengesCurrentUserBackground: '#fff7ed',
  challengesCurrentUserBorder: '#fdba74',
  
  // Community Events specific colors
  eventsPrimary: '#9333ea',
  eventsPrimaryLight: '#e9d5ff',
  eventsBackground: '#faf5ff',
  eventsCardBackground: '#ffffff',
  eventsActiveBackground: '#f3e8ff',
  eventsUpcomingBackground: '#dbeafe',
  eventsCompletedBackground: '#f0f9ff',
  
  // Community Courses specific colors (Cyan from Color Guide)
  coursesPrimary: '#47c7ea',
  coursesPrimaryLight: '#dbeafe',
  coursesBackground: '#eff6ff',
  coursesCardBackground: '#ffffff',
  coursesActiveBackground: '#dbeafe',
  coursesCompletedBackground: '#ecfdf5',
  coursesProgressBackground: '#f3f4f6',
  
  // Community Products specific colors
  productsPrimary: '#6366f1',
  productsPrimaryLight: '#c7d2fe',
  productsBackground: '#eef2ff',
  productsCardBackground: '#ffffff',
  productsActiveBackground: '#c7d2fe',
  productsFeaturedBackground: '#fef3c7',
  productsSaleBackground: '#fee2e2',
  
  // Community Sessions specific colors (Pink from Color Guide)
  sessionsPrimary: '#f65887',
  sessionsPrimaryLight: '#fce7f3',
  sessionsBackground: '#fdf2f8',
  sessionsCardBackground: '#ffffff',
  sessionsActiveBackground: '#fce7f3',
  sessionsLiveBackground: '#dcfce7',
  sessionsUpcomingBackground: '#dbeafe',
  
  // Success colors (modern gradient)
  successGradientStart: '#00f260',
  successGradientEnd: '#0575e6',
  successGlow: 'rgba(0, 242, 96, 0.2)',
  
  // Modern gradient colors
  modernGradientStart: '#667eea',
  modernGradientEnd: '#764ba2',
  
  // Minimalist colors
  minimalistYellow: '#F4D03F',
  minimalistYellowLight: '#F7DC6F',
  minimalistYellowDark: '#F1C40F',
  minimalistOrange: '#F39C12',
  minimalistDark: '#2C3E50',
  minimalistGray: '#7F8C8D',
  minimalistBorder: '#BDC3C7',
  
  // Common grays
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  
  // Status colors
  success: '#10b981',
  successBackground: '#ecfdf5',
  successDark: '#059669',
  warning: '#f59e0b',
  warningBackground: '#fff7ed',
  error: '#ef4444',
  errorBackground: '#fef2f2',
  errorDark: '#dc2626',
  
  white: '#ffffff',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  xs: 2,
  sm: 6,
  md: 8,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 999,
};

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
};

export const fontWeight = {
  light: '300' as const,
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};
