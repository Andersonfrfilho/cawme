import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
    padding: theme.spacing[4],
  },
  loader: {
    marginTop: theme.spacing[8],
  },
  error: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.status.error,
    textAlign: "center",
    marginTop: theme.spacing[6],
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[4],
  },
});
