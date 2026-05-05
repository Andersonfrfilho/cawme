import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { verticalScale, moderateScale } from "@/shared/utils/scale";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },
  loader: {
    marginTop: verticalScale(32),
  },
  footerLoader: {
    marginVertical: verticalScale(16),
  },
  error: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.status.error,
    textAlign: "center",
    marginTop: verticalScale(24),
    paddingHorizontal: theme.spacing[4],
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
  },
  item: {
    padding: theme.spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.DEFAULT,
    backgroundColor: theme.colors.background.DEFAULT,
  },
  emptyContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: verticalScale(100),
  },
  listContent: {
    paddingBottom: verticalScale(100),
  },
  emptyContainer: {
    alignItems: "center",
    paddingHorizontal: theme.spacing[6],
  },
  emptyText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing[4],
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.tertiary,
    marginTop: theme.spacing[2],
    textAlign: "center",
    fontStyle: "italic",
  },
});
