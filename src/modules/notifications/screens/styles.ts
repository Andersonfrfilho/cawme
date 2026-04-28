import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },
  loader: {
    marginTop: theme.spacing[8],
  },
  notificationCard: {
    flexDirection: "row",
    padding: theme.spacing[4],
    backgroundColor: theme.palette.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.DEFAULT,
    alignItems: "flex-start",
  },
  readCard: {
    backgroundColor: theme.colors.background.DEFAULT,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.radii.full,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette.neutral[100],
    marginRight: theme.spacing[3],
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[1],
  },
  readText: {
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.regular,
  },
  body: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },
  time: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.primary.DEFAULT,
    marginTop: theme.spacing[2],
  },
  empty: {
    padding: theme.spacing[10],
    alignItems: "center",
  },
  emptyText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
});
