import { useColorScheme } from '@/hooks/useColorScheme';

/**
 * Hook pour obtenir les couleurs adaptatives selon le thème
 */
export const useAdaptiveColors = () => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return {
    // Couleurs pour les cartes et containers
    cardBackground: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.25)',
    cardBorder: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.4)',
    
    // Couleurs pour les inputs
    inputBackground: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(255, 255, 255, 0.7)',
    inputBorder: isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.5)',
    inputText: isDark ? '#ffffff' : '#1f2937',
    
    // Couleurs pour les textes
    primaryText: isDark ? '#ffffff' : '#1f2937',
    secondaryText: isDark ? '#d1d5db' : '#6b7280',
    linkText: isDark ? '#86e4fd' : '#0ea5e9',
    
    // Couleurs pour les boutons
    primaryButtonBackground: isDark ? 'rgba(142, 120, 251, 1)' : 'rgba(142, 120, 251, 1)',
    secondaryButtonBackground: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.9)',
    secondaryButtonBorder: isDark ? 'rgba(255, 255, 255, 0.4)' : 'rgba(255, 255, 255, 0.5)',
    secondaryButtonText: isDark ? '#ffffff' : '#374151',
    
    // Couleurs pour les dividers
    dividerLine: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.4)',
    
    // Couleurs de statut
    successBackground: isDark ? 'rgba(16, 185, 129, 0.15)' : '#ecfdf5',
    errorBackground: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fef2f2',
    
    // Utilitaires
    isDark,
    isLight: !isDark,
  };
};
