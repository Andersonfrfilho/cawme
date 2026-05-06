import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

export const styles = StyleSheet.create({
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    height: verticalScale(52),
    backgroundColor: theme.palette.neutral[0],
    borderWidth: 1,
    borderColor: theme.palette.neutral[200],
    borderRadius: theme.radii.md,
    paddingHorizontal: moderateScale(16, 0.5),
    marginBottom: verticalScale(12),
    shadowColor: theme.colors.primary.darker,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  inputRowFocused: {
    borderColor: theme.colors.primary.DEFAULT,
    shadowColor: theme.colors.primary.DEFAULT,
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  inputRowError: {
    borderColor: theme.colors.status.error,
    backgroundColor: theme.palette.error[50],
  },
  inputIcon: {
    marginRight: moderateScale(12, 0.5),
  },
  inputText: {
    flex: 1,
    fontSize: moderateScale(15, 0.3),
    color: theme.colors.text.primary,
  },
  fieldError: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.status.error,
    marginTop: verticalScale(-8),
    marginBottom: verticalScale(8),
    marginLeft: moderateScale(4, 0.5),
  },
  row: {
    flexDirection: "row",
    gap: moderateScale(12, 0.5),
  },
  rowHalf: {
    flex: 1,
  },
  businessHourRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.neutral[100],
  },
  businessHourDay: {
    fontSize: moderateScale(15, 0.3),
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    width: moderateScale(80, 0.5),
  },
  businessHourToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(8, 0.5),
  },
  businessHourToggleTrack: {
    width: moderateScale(44, 0.5),
    height: moderateScale(24, 0.5),
    borderRadius: moderateScale(12, 0.5),
    backgroundColor: theme.palette.neutral[300],
    justifyContent: "center",
    paddingHorizontal: moderateScale(2, 0.5),
  },
  businessHourToggleTrackActive: {
    backgroundColor: theme.colors.status.success,
  },
  businessHourToggleThumb: {
    width: moderateScale(20, 0.5),
    height: moderateScale(20, 0.5),
    borderRadius: moderateScale(10, 0.5),
    backgroundColor: theme.palette.neutral[0],
  },
  businessHourTimes: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(8, 0.5),
  },
  businessHourTimeInput: {
    width: moderateScale(70, 0.5),
    height: verticalScale(36),
    backgroundColor: theme.palette.neutral[0],
    borderWidth: 1,
    borderColor: theme.palette.neutral[200],
    borderRadius: theme.radii.md,
    textAlign: "center",
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.primary,
  },
  reviewCard: {
    backgroundColor: theme.palette.neutral[0],
    borderRadius: theme.radii.lg,
    padding: moderateScale(16, 0.5),
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: theme.palette.neutral[100],
  },
  reviewSectionTitle: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.DEFAULT,
    marginBottom: verticalScale(8),
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  reviewRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(6),
  },
  reviewIcon: {
    marginRight: moderateScale(10, 0.5),
    width: moderateScale(20, 0.5),
  },
  reviewLabel: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.text.secondary,
    width: moderateScale(100, 0.5),
  },
  reviewValue: {
    flex: 1,
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
});
