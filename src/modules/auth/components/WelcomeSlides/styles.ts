import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { scale, moderateScale, verticalScale } from "@/shared/utils/scale";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  slide: {
    width: scale(390),
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: moderateScale(40, 0.5),
  },
  iconContainer: {
    width: verticalScale(120),
    height: verticalScale(120),
    borderRadius: verticalScale(60),
    backgroundColor: theme.colors.primary.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(24),
    ...theme.shadows.lg,
  },
  headline: {
    fontSize: moderateScale(22, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: "center",
    marginBottom: verticalScale(12),
  },
  description: {
    fontSize: moderateScale(15, 0.3),
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: moderateScale(22, 0.3),
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: moderateScale(8, 0.5),
    marginTop: verticalScale(24),
  },
  dot: {
    width: moderateScale(8, 0.5),
    height: moderateScale(8, 0.5),
    borderRadius: moderateScale(4, 0.5),
    backgroundColor: theme.palette.neutral[300],
  },
  dotActive: {
    backgroundColor: theme.colors.primary.DEFAULT,
  },
});
