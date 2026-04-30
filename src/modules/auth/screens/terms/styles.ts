import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { scale, moderateScale, verticalScale } from "@/shared/utils/scale";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: moderateScale(16, 0.5),
    gap: verticalScale(16),
    paddingBottom: verticalScale(180),
  },
  summaryCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.radii.lg,
    padding: moderateScale(16, 0.5),
    ...theme.shadows.sm,
  },
  summaryTitle: {
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(12),
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(8, 0.5),
    marginBottom: verticalScale(8),
  },
  summaryText: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.primary,
  },
  termsCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.radii.lg,
    padding: moderateScale(16, 0.5),
    ...theme.shadows.sm,
  },
  termsCardTitle: {
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(12),
  },
  termsText: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
    lineHeight: moderateScale(22, 0.3),
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.palette.neutral[0],
    paddingHorizontal: moderateScale(16, 0.5),
    paddingTop: verticalScale(16),
    borderTopWidth: 1,
    borderTopColor: theme.palette.neutral[100],
    ...theme.shadows.lg,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  checkbox: {
    width: moderateScale(22, 0.5),
    height: moderateScale(22, 0.5),
    borderRadius: moderateScale(4, 0.5),
    borderWidth: 2,
    borderColor: theme.palette.neutral[300],
    justifyContent: "center",
    alignItems: "center",
    marginRight: moderateScale(10, 0.5),
  },
  checkboxActive: {
    backgroundColor: theme.colors.primary.DEFAULT,
    borderColor: theme.colors.primary.DEFAULT,
  },
  checkboxText: {
    flex: 1,
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
  },
  linkText: {
    color: theme.colors.primary.DEFAULT,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  submitButton: {
    backgroundColor: theme.colors.primary.DEFAULT,
    height: verticalScale(56),
    borderRadius: theme.radii.xl,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.md,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: theme.palette.neutral[0],
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: moderateScale(32, 0.5),
  },
  errorTitle: {
    fontSize: moderateScale(18, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginTop: verticalScale(16),
    marginBottom: verticalScale(8),
  },
  errorDescription: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginBottom: verticalScale(24),
  },
  errorButton: {
    backgroundColor: theme.colors.primary.DEFAULT,
    height: verticalScale(56),
    borderRadius: theme.radii.xl,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    ...theme.shadows.md,
  },
  errorButtonText: {
    color: theme.palette.neutral[0],
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
  },
});
