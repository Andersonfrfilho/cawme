import { StyleSheet, Dimensions } from "react-native";
import { theme } from "@/shared/constants";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  hero: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  heroCircle1: {
    position: "absolute",
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    top: -width * 0.3,
    right: -width * 0.2,
  },
  heroCircle2: {
    position: "absolute",
    width: width * 0.6,
    height: width * 0.6,
    borderRadius: width * 0.3,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    bottom: -width * 0.1,
    left: -width * 0.1,
  },
  heroCircle3: {
    position: "absolute",
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    top: 40,
    left: 20,
  },
  heroContent: {
    alignItems: "center",
    zIndex: 1,
  },
  logoMark: {
    width: 64,
    height: 64,
    borderRadius: theme.radii.xl,
    backgroundColor: theme.palette.neutral[0],
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing[4],
    ...theme.shadows.lg,
  },
  appName: {
    fontSize: theme.typography.fontSize["4xl"],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
    letterSpacing: theme.typography.letterSpacing.tight,
  },
  tagline: {
    fontSize: theme.typography.fontSize.base,
    color: "rgba(255, 255, 255, 0.8)",
    marginTop: theme.spacing[1],
  },
});

export default styles;
