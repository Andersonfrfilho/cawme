import { StyleSheet } from 'react-native';
import { theme } from "@/shared/constants";

export const styles = StyleSheet.create({
  requestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing[3.5],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.DEFAULT,
    alignItems: 'center',
  },
  requestContent: {
    flex: 1,
  },
  requestTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[0.5],
  },
  requestDate: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  statusBadge: {
    borderRadius: theme.radii.sm,
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    marginLeft: theme.spacing[3],
  },
  statusText: {
    fontSize: 11,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
    textTransform: 'uppercase',
  },
});
