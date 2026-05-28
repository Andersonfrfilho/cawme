import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background.DEFAULT,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing[6],
    backgroundColor: theme.colors.background.DEFAULT,
  },
  errorText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.status.error,
    textAlign: "center",
    marginBottom: theme.spacing[4],
  },
  retryText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.DEFAULT,
  },
  guestContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: moderateScale(32, 0.5),
    backgroundColor: theme.colors.background.DEFAULT,
  },
  guestTitle: {
    fontSize: moderateScale(24, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: "center",
    marginTop: verticalScale(24),
    marginBottom: verticalScale(8),
  },
  guestDescription: {
    fontSize: moderateScale(15, 0.3),
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: moderateScale(22, 0.3),
    marginBottom: verticalScale(32),
  },
  guestButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary.DEFAULT,
    height: verticalScale(56),
    borderRadius: theme.radii.xl,
    paddingHorizontal: moderateScale(24, 0.5),
    ...theme.shadows.md,
  },
  guestButtonText: {
    color: theme.palette.neutral[0],
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
  },
  pendingOnboardingBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background.elevated,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary.DEFAULT,
    marginHorizontal: moderateScale(16, 0.5),
    marginTop: verticalScale(12),
    marginBottom: verticalScale(4),
    borderRadius: theme.radii.md,
    padding: moderateScale(12, 0.5),
    ...theme.shadows.sm,
  },
  pendingOnboardingIconContainer: {
    width: moderateScale(36, 0.5),
    height: moderateScale(36, 0.5),
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.primary.light,
    justifyContent: "center",
    alignItems: "center",
    marginRight: moderateScale(12, 0.5),
  },
  pendingOnboardingContent: {
    flex: 1,
  },
  pendingOnboardingTitle: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(2),
  },
  pendingOnboardingSubtitle: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.secondary,
    lineHeight: moderateScale(17, 0.3),
  },
});
