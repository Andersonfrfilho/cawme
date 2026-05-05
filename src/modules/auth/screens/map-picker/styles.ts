import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },
  map: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  addressCard: {
    position: "absolute",
    bottom: 0,
    left: moderateScale(16, 0.5),
    right: moderateScale(16, 0.5),
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(8, 0.5),
    backgroundColor: theme.palette.neutral[0],
    borderRadius: theme.radii.lg,
    padding: moderateScale(12, 0.5),
    ...theme.shadows.lg,
  },
  addressText: {
    flex: 1,
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.primary,
  },
  currentLocationButton: {
    position: "absolute",
    left: moderateScale(16, 0.5),
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(8, 0.5),
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: theme.radii.full,
    paddingHorizontal: moderateScale(16, 0.5),
    paddingVertical: moderateScale(10, 0.5),
    ...theme.shadows.md,
  },
  currentLocationText: {
    color: theme.palette.neutral[0],
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
  },
  confirmText: {
    color: theme.colors.primary.DEFAULT,
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
  },
  confirmTextDisabled: {
    opacity: 0.4,
  },
});
