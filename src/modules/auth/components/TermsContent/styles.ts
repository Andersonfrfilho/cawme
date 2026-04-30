import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { scale, moderateScale, verticalScale } from "@/shared/utils/scale";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.palette.neutral[0],
    borderTopLeftRadius: theme.radii["3xl"],
    borderTopRightRadius: theme.radii["3xl"],
    paddingHorizontal: moderateScale(24, 0.5),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(40),
  },
  termsScroll: {
    flex: 1,
    marginBottom: verticalScale(24),
  },
  termsContent: {
    paddingBottom: verticalScale(16),
  },
  termsText: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
    lineHeight: moderateScale(22, 0.3),
  },
  actionsContainer: {
    gap: verticalScale(16),
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    width: moderateScale(20, 0.5),
    height: moderateScale(20, 0.5),
    borderRadius: theme.radii.xs,
    borderWidth: 1.5,
    borderColor: theme.palette.neutral[300],
    justifyContent: "center",
    alignItems: "center",
    marginRight: moderateScale(12, 0.5),
    marginTop: moderateScale(2, 0.5),
  },
  checkboxActive: {
    backgroundColor: theme.colors.primary.DEFAULT,
    borderColor: theme.colors.primary.DEFAULT,
  },
  checkboxText: {
    flex: 1,
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
    lineHeight: moderateScale(20, 0.3),
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
});
