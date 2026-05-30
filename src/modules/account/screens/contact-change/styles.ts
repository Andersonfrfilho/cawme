import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },
  header: {
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(24),
    paddingHorizontal: moderateScale(24, 0.5),
    alignItems: "center",
  },
  headerTitle: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
  },
  content: {
    flex: 1,
    paddingHorizontal: moderateScale(24, 0.5),
    paddingTop: verticalScale(32),
    gap: moderateScale(16, 0.5),
  },
  descriptionText: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
    lineHeight: moderateScale(20, 0.3),
  },
  sentToText: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  sentToValue: {
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  input: {
    height: verticalScale(52),
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
    paddingHorizontal: moderateScale(16, 0.5),
    fontSize: moderateScale(15, 0.3),
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.elevated,
  },
  inputFocused: {
    borderColor: theme.colors.primary.DEFAULT,
  },
  otpInput: {
    height: verticalScale(56),
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
    paddingHorizontal: moderateScale(16, 0.5),
    fontSize: moderateScale(22, 0.3),
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.elevated,
    textAlign: "center",
    letterSpacing: 8,
  },
  otpInputFocused: {
    borderColor: theme.colors.primary.DEFAULT,
  },
  errorText: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.status.error,
  },
  primaryButton: {
    height: verticalScale(52),
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(8),
  },
  primaryButtonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
  },
  resendRow: {
    alignItems: "center",
    marginTop: verticalScale(16),
  },
  resendText: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.primary.DEFAULT,
    fontWeight: theme.typography.fontWeight.medium,
  },
});

export default styles;
