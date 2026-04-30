import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: theme.palette.neutral[0],
    borderRadius: theme.radii.full,
    padding: moderateScale(4, 0.5),
    marginBottom: verticalScale(24),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: theme.palette.neutral[200],
    shadowColor: theme.colors.primary.darker,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  pill: {
    position: "absolute",
    left: moderateScale(4, 0.5),
    top: moderateScale(4, 0.5),
    width: "50%",
    height: verticalScale(40),
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.primary.DEFAULT,
    shadowColor: theme.colors.primary.DEFAULT,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  option: {
    flex: 1,
    height: verticalScale(40),
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  optionText: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  optionTextActive: {
    color: theme.palette.neutral[0],
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
