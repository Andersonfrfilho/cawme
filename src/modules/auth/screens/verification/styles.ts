import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },
  header: {
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingTop: verticalScale(60),
    paddingBottom: verticalScale(24),
    paddingHorizontal: moderateScale(24, 0.5),
    alignItems: "center",
  },
  headerTitle: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
  },
  headerSubtitle: {
    fontSize: moderateScale(14, 0.3),
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: verticalScale(4),
  },
  content: {
    flex: 1,
    paddingHorizontal: moderateScale(24, 0.5),
    paddingTop: verticalScale(32),
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.radii.md,
    padding: moderateScale(4, 0.5),
    marginBottom: verticalScale(24),
  },
  tab: {
    flex: 1,
    height: verticalScale(40),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: theme.radii.sm,
  },
  tabActive: {
    backgroundColor: theme.colors.primary.DEFAULT,
  },
  tabText: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  tabTextActive: {
    color: theme.palette.neutral[0],
    fontWeight: theme.typography.fontWeight.semibold,
  },
  codeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: moderateScale(12, 0.5),
    marginBottom: verticalScale(24),
  },
  codeInput: {
    width: moderateScale(56, 0.5),
    height: verticalScale(64),
    borderRadius: theme.radii.md,
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
    backgroundColor: theme.colors.background.card,
    fontSize: moderateScale(24, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: "center",
  },
  codeInputFocused: {
    borderColor: theme.colors.primary.DEFAULT,
  },
  codeInputFilled: {
    backgroundColor: theme.colors.primary.surface,
    borderColor: theme.colors.primary.DEFAULT,
  },
  targetInfo: {
    textAlign: "center",
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
    marginBottom: verticalScale(24),
  },
  targetHighlight: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  verifyButton: {
    backgroundColor: theme.colors.primary.DEFAULT,
    height: verticalScale(56),
    borderRadius: theme.radii.xl,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.md,
  },
  verifyButtonDisabled: {
    opacity: 0.5,
  },
  verifyButtonText: {
    color: theme.palette.neutral[0],
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
  },
  resendContainer: {
    alignItems: "center",
    marginTop: verticalScale(16),
  },
  resendText: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
  },
  resendLink: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.DEFAULT,
  },
  errorText: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.status.error,
    textAlign: "center",
    marginBottom: verticalScale(16),
  },
});
