import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

export const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: theme.palette.neutral[0],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: moderateScale(24, 0.5),
    paddingBottom: verticalScale(40),
    paddingTop: verticalScale(8),
  },
  handle: {
    width: moderateScale(40, 0.5),
    height: 4,
    borderRadius: 2,
    backgroundColor: theme.palette.neutral[200],
    alignSelf: "center",
    marginBottom: verticalScale(24),
  },
  iconContainer: {
    width: moderateScale(64, 0.5),
    height: moderateScale(64, 0.5),
    borderRadius: 32,
    backgroundColor: theme.colors.primary.DEFAULT + "15",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: verticalScale(16),
  },
  title: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: "center",
    marginBottom: verticalScale(8),
  },
  subtitle: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: moderateScale(20, 0.3),
    marginBottom: verticalScale(28),
  },
  optionNow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: theme.radii.lg,
    padding: moderateScale(16, 0.5),
    marginBottom: verticalScale(12),
    gap: moderateScale(12, 0.5),
  },
  optionLater: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background.DEFAULT,
    borderRadius: theme.radii.lg,
    padding: moderateScale(16, 0.5),
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
    gap: moderateScale(12, 0.5),
  },
  optionIconNow: {
    width: moderateScale(40, 0.5),
    height: moderateScale(40, 0.5),
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  optionIconLater: {
    width: moderateScale(40, 0.5),
    height: moderateScale(40, 0.5),
    borderRadius: 20,
    backgroundColor: theme.colors.primary.DEFAULT + "12",
    justifyContent: "center",
    alignItems: "center",
  },
  optionTextGroup: {
    flex: 1,
  },
  optionTitleNow: {
    fontSize: moderateScale(15, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
    marginBottom: verticalScale(2),
  },
  optionDescriptionNow: {
    fontSize: moderateScale(12, 0.3),
    color: "rgba(255,255,255,0.75)",
  },
  optionTitleLater: {
    fontSize: moderateScale(15, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(2),
  },
  optionDescriptionLater: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.secondary,
  },
});
