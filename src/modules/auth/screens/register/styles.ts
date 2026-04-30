import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.palette.neutral[50],
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.palette.neutral[50],
  },
  header: {
    backgroundColor: theme.palette.neutral[0],
    alignItems: "center",
    paddingBottom: verticalScale(24),
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.neutral[100],
    shadowColor: theme.colors.primary.darker,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  logoMark: {
    width: verticalScale(48),
    height: verticalScale(48),
    borderRadius: theme.radii.xl,
    backgroundColor: theme.colors.primary.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(12),
    shadowColor: theme.colors.primary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  appName: {
    fontSize: moderateScale(24, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    letterSpacing: theme.typography.letterSpacing.tight,
  },
  tagline: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.text.secondary,
    marginTop: verticalScale(4),
  },
  scrollContent: {
    flexGrow: 1,
    backgroundColor: theme.palette.neutral[50],
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: moderateScale(24, 0.5),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(40),
  },
});
