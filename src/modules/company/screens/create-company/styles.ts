import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: moderateScale(24, 0.5),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(12),
  },
  headerTitle: {
    fontSize: moderateScale(24, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(4),
  },
  headerSubtitle: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(16),
    gap: moderateScale(8, 0.5),
  },
  stepDot: {
    width: moderateScale(10, 0.3),
    height: moderateScale(10, 0.3),
    borderRadius: moderateScale(5, 0.3),
    backgroundColor: theme.palette.neutral[200],
  },
  stepDotActive: {
    backgroundColor: theme.colors.primary.DEFAULT,
    width: moderateScale(28, 0.3),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: moderateScale(24, 0.5),
    paddingBottom: verticalScale(32),
  },
  sectionTitle: {
    fontSize: moderateScale(18, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(16),
    marginTop: verticalScale(8),
  },
  sectionSubtitle: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
    marginBottom: verticalScale(16),
  },
  footer: {
    paddingHorizontal: moderateScale(24, 0.5),
    paddingVertical: verticalScale(16),
    backgroundColor: theme.palette.neutral[0],
    borderTopWidth: 1,
    borderTopColor: theme.palette.neutral[100],
    flexDirection: "row",
    gap: moderateScale(12, 0.5),
  },
  footerButton: {
    flex: 1,
    height: verticalScale(52),
    borderRadius: theme.radii.xl,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette.neutral[100],
  },
  footerButtonPrimary: {
    backgroundColor: theme.colors.primary.DEFAULT,
  },
  footerButtonDisabled: {
    opacity: 0.5,
  },
  footerButtonText: {
    fontSize: moderateScale(15, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  footerButtonTextPrimary: {
    color: theme.palette.neutral[0],
  },
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: moderateScale(32, 0.5),
  },
  successIcon: {
    marginBottom: verticalScale(24),
  },
  successTitle: {
    fontSize: moderateScale(22, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(8),
    textAlign: "center",
  },
  successDescription: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginBottom: verticalScale(32),
  },
  successButton: {
    backgroundColor: theme.colors.primary.DEFAULT,
    height: verticalScale(52),
    borderRadius: theme.radii.xl,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: moderateScale(32, 0.5),
  },
  successButtonText: {
    fontSize: moderateScale(15, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.palette.neutral[0],
  },
});
