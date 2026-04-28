import { StyleSheet } from 'react-native';
import { theme } from "@/shared/constants";

export const styles = StyleSheet.create({
  statCard: {
    alignItems: 'center',
    padding: theme.spacing[3],
    width: 110,
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.radii.lg,
    ...theme.shadows.sm,
  },
  statValue: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.DEFAULT,
    marginTop: theme.spacing[1.5],
  },
  statLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[1],
    textAlign: 'center',
  },
});
