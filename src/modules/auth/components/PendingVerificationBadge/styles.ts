import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

export const styles = StyleSheet.create({
  // Banner variant
  bannerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.palette.yellow[50],
    borderRadius: theme.radii.lg,
    padding: moderateScale(16, 0.5),
    marginHorizontal: moderateScale(16, 0.5),
    marginTop: verticalScale(12),
    borderWidth: 1,
    borderColor: theme.palette.yellow[200],
  },
  bannerIconContainer: {
    width: moderateScale(40, 0.5),
    height: moderateScale(40, 0.5),
    borderRadius: moderateScale(20, 0.5),
    backgroundColor: theme.palette.yellow[100],
    justifyContent: "center",
    alignItems: "center",
    marginRight: moderateScale(12, 0.5),
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(2),
  },
  bannerSubtitle: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.secondary,
  },
  bannerArrow: {
    marginLeft: moderateScale(8, 0.5),
  },
  bannerCountBadge: {
    position: "absolute",
    top: -moderateScale(6, 0.5),
    right: -moderateScale(6, 0.5),
    backgroundColor: theme.colors.status.error,
    borderRadius: moderateScale(10, 0.5),
    minWidth: moderateScale(20, 0.5),
    height: moderateScale(20, 0.5),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: moderateScale(4, 0.5),
  },
  bannerCountText: {
    fontSize: moderateScale(11, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
  },

  // Pill variant
  pillContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6, 0.5),
    backgroundColor: theme.palette.yellow[50],
    borderRadius: theme.radii.xl,
    paddingHorizontal: moderateScale(12, 0.5),
    paddingVertical: verticalScale(6),
    borderWidth: 1,
    borderColor: theme.palette.yellow[200],
  },
  pillText: {
    fontSize: moderateScale(12, 0.3),
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.status.warning,
  },

  // Dot variant
  dotContainer: {
    position: "relative",
  },
  dotBadge: {
    position: "absolute",
    top: -moderateScale(6, 0.5),
    right: -moderateScale(6, 0.5),
    backgroundColor: theme.colors.status.error,
    borderRadius: moderateScale(10, 0.5),
    minWidth: moderateScale(18, 0.5),
    height: moderateScale(18, 0.5),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: moderateScale(4, 0.5),
    borderWidth: 2,
    borderColor: theme.palette.neutral[0],
  },
  dotText: {
    fontSize: moderateScale(10, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
  },
});
