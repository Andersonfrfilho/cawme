import { StyleSheet } from 'react-native';
import { colors, theme } from '@/shared/constants';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[8],
    paddingBottom: theme.spacing[12],
  },
  content: {
    width: '100%',
    alignItems: 'center',
  },
  illustrationWrapper: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing[6],
  },
  codeText: {
    fontSize: theme.typography.fontSize['5xl'],
    fontWeight: theme.typography.fontWeight.extrabold as '800',
    letterSpacing: theme.typography.letterSpacing.tight,
    marginBottom: theme.spacing[2],
    textAlign: 'center',
  },
  title: {
    fontSize: theme.typography.fontSize['2xl'],
    fontWeight: theme.typography.fontWeight.bold as '700',
    color: colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing[3],
    lineHeight: theme.typography.fontSize['2xl'] * theme.typography.lineHeight.tight,
  },
  message: {
    fontSize: theme.typography.fontSize.base,
    color: colors.text.secondary,
    textAlign: 'center',
    lineHeight: theme.typography.fontSize.base * theme.typography.lineHeight.relaxed,
    marginBottom: theme.spacing[10],
  },
  actions: {
    gap: theme.spacing[3],
    width: '100%',
    alignItems: 'center',
  },
  retryButton: {
    width: '100%',
    height: theme.metrics.buttonHeight.md,
    borderRadius: theme.metrics.buttonRadius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold as '600',
    color: colors.text.inverse,
  },
  backButton: {
    width: '100%',
    height: theme.metrics.buttonHeight.md,
    borderRadius: theme.metrics.buttonRadius,
    borderWidth: 1.5,
    borderColor: colors.border.DEFAULT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium as '500',
    color: colors.text.secondary,
  },
});
