import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { scale, moderateScale, verticalScale } from "@/shared/utils/scale";

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: moderateScale(24, 0.5),
    paddingBottom: verticalScale(40),
    gap: verticalScale(16),
  },
  primaryButton: {
    backgroundColor: theme.colors.primary.DEFAULT,
    height: verticalScale(56),
    borderRadius: theme.radii.xl,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.md,
  },
  primaryButtonText: {
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.palette.neutral[0],
  },
  outlineButton: {
    height: verticalScale(56),
    borderRadius: theme.radii.xl,
    borderWidth: 1.5,
    borderColor: theme.colors.primary.DEFAULT,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette.neutral[0],
  },
  outlineButtonText: {
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.DEFAULT,
  },
  buttonIcon: {
    marginRight: moderateScale(8, 0.5),
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(8),
  },
  loginText: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
  },
  loginLink: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.DEFAULT,
  },
});
