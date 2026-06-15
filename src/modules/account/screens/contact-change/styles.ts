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
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: moderateScale(12, 0.5),
  },
  headerTitle: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
  },
  content: {
    flex: 1,
    paddingHorizontal: moderateScale(24, 0.5),
  },
  contentContainer: {
    paddingTop: verticalScale(32),
    paddingBottom: verticalScale(48),
    gap: verticalScale(24),
  },
  descriptionText: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
    lineHeight: moderateScale(21, 0.3),
  },
  fieldGroup: {
    gap: verticalScale(6),
  },
  fieldLabel: {
    fontSize: moderateScale(12, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
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
  errorText: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.status.error,
    marginTop: verticalScale(2),
  },
  primaryButton: {
    height: verticalScale(52),
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
  },
  phoneInputRow: {
    height: verticalScale(52),
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
    backgroundColor: theme.colors.background.elevated,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
  },
  phoneInputRowFocused: {
    borderColor: theme.colors.primary.DEFAULT,
  },
  phonePrefix: {
    paddingHorizontal: moderateScale(14, 0.5),
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "stretch",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: theme.colors.border.DEFAULT,
    gap: moderateScale(6, 0.5),
  },
  phonePrefixText: {
    fontSize: moderateScale(15, 0.3),
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  phoneTextInput: {
    flex: 1,
    height: "100%" as unknown as number,
    paddingHorizontal: moderateScale(14, 0.5),
    fontSize: moderateScale(15, 0.3),
    color: theme.colors.text.primary,
  },
  destinationCard: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: 14,
    paddingVertical: verticalScale(16),
    paddingHorizontal: moderateScale(20, 0.5),
    alignItems: "center",
    gap: verticalScale(4),
  },
  destinationLabel: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  destinationValue: {
    fontSize: moderateScale(18, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: "center",
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: moderateScale(12, 0.5),
  },
  otpBox: {
    width: moderateScale(64, 0.5),
    height: verticalScale(72),
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
    backgroundColor: theme.colors.background.elevated,
    fontSize: moderateScale(28, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: "center",
  },
  otpBoxFilled: {
    backgroundColor: theme.colors.primary.surface,
    borderColor: theme.colors.primary.DEFAULT,
    color: theme.colors.primary.DEFAULT,
  },
  resendSection: {
    alignItems: "center",
    gap: verticalScale(8),
  },
  countdownBadge: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: 20,
    paddingVertical: verticalScale(8),
    paddingHorizontal: moderateScale(16, 0.5),
  },
  resendText: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  resendLink: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.primary.DEFAULT,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});

export default styles;
