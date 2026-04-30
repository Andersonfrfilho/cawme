import { StyleSheet, StatusBar } from "react-native";
import { theme } from "@/shared/constants";
import { scale, moderateScale, verticalScale } from "@/shared/utils/scale";
import { HERO_OVERLAY } from "../../auth.constants";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.palette.neutral[0],
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.palette.neutral[0],
  },
  heroSection: {
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingTop: verticalScale(60),
    paddingBottom: verticalScale(40),
    alignItems: "center",
  },
  logoContainer: {
    width: verticalScale(56),
    height: verticalScale(56),
    borderRadius: theme.radii.xl,
    backgroundColor: theme.palette.neutral[0],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(16),
    ...theme.shadows.lg,
  },
  appName: {
    fontSize: moderateScale(28, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
    letterSpacing: theme.typography.letterSpacing.tight,
  },
  tagline: {
    fontSize: moderateScale(14, 0.3),
    color: HERO_OVERLAY.white80,
    marginTop: verticalScale(4),
  },
  slidesContainer: {
    flex: 1,
    justifyContent: "center",
  },
  actionsContainer: {
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(20),
  },
});
