// Main theme configuration following industrial standards
import { colors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';
import { shadows } from './shadows';

// Unified theme object
export const theme = {
  colors,
  spacing,
  typography,
  shadows,
  
  // Common style helpers
  common: {
    // Container styles
    container: {
      flex: 1,
      backgroundColor: colors.background.primary,
    },
    
    // Card styles
    card: {
      backgroundColor: colors.background.secondary,
      borderRadius: spacing.radius.lg,
      padding: spacing.cardPadding,
      ...shadows.card,
    },
    
    // Button styles
    button: {
      primary: {
        backgroundColor: colors.primary[500],
        borderRadius: spacing.radius.md,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.button,
      },
      secondary: {
        backgroundColor: colors.background.secondary,
        borderRadius: spacing.radius.md,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: colors.border.medium,
      },
    },
    
    // Text styles
    text: {
      display: {
        ...typography.styles.display,
        color: colors.text.primary,
      },
      h1: {
        ...typography.styles.h1,
        color: colors.text.primary,
      },
      h2: {
        ...typography.styles.h2,
        color: colors.text.primary,
      },
      h3: {
        ...typography.styles.h3,
        color: colors.text.primary,
      },
      body: {
        ...typography.styles.body,
        color: colors.text.primary,
      },
      bodySmall: {
        ...typography.styles.bodySmall,
        color: colors.text.secondary,
      },
      caption: {
        ...typography.styles.caption,
        color: colors.text.secondary,
      },
      button: {
        ...typography.styles.button,
        color: colors.text.inverse,
      },
    },
  },
};

// Export individual theme components
export { colors, spacing, typography, shadows };

// Export theme as default
export default theme; 