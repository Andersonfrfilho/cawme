import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";

export const styles = StyleSheet.create({
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  forceUpdateContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.palette.neutral[0],
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing[8],
    zIndex: 9999,
  },
  forceUpdateTitle: {
    fontSize: theme.typography.fontSize["2xl"],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
    textAlign: "center",
  },
  forceUpdateBody: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginBottom: theme.spacing[8],
    lineHeight: 22,
  },
  updateButton: {
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingHorizontal: theme.spacing[8],
    paddingVertical: theme.spacing[4],
    borderRadius: theme.radii.lg,
  },
  updateButtonText: {
    color: theme.palette.neutral[0],
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
