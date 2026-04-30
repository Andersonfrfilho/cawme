import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: moderateScale(32, 0.5),
  },
  iconContainer: {
    width: verticalScale(100),
    height: verticalScale(100),
    borderRadius: verticalScale(50),
    backgroundColor: theme.colors.primary.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(32),
    ...theme.shadows.lg,
  },
  title: {
    fontSize: moderateScale(24, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: "center",
    marginBottom: verticalScale(16),
  },
  description: {
    fontSize: moderateScale(15, 0.3),
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: moderateScale(22, 0.3),
    marginBottom: verticalScale(8),
  },
  email: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.DEFAULT,
    textAlign: "center",
    marginBottom: verticalScale(32),
  },
  loginButton: {
    backgroundColor: theme.colors.primary.DEFAULT,
    height: verticalScale(56),
    borderRadius: theme.radii.xl,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    ...theme.shadows.md,
  },
  loginButtonText: {
    color: theme.palette.neutral[0],
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
  },
});
