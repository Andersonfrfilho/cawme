import { StyleSheet, Dimensions } from "react-native";
import { theme } from "@/shared/constants";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.palette.neutral[0],
  },
  safeArea: {
    flex: 1,
    backgroundColor: theme.palette.neutral[0],
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  backgroundLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.primary.DEFAULT,
  },
  heroForeground: {
    width: "100%",
  },
  footerFill: {
    width: "100%",
    backgroundColor: theme.palette.neutral[0],
  },
  hero: {
    height: 240,
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
  formCard: {
    flex: 1,
    backgroundColor: theme.palette.neutral[0],
    borderTopLeftRadius: theme.radii["3xl"],
    borderTopRightRadius: theme.radii["3xl"],
    paddingHorizontal: theme.spacing[7],
    paddingTop: theme.spacing[8],
    paddingBottom: theme.spacing[10],
  },
  cardTitle: {
    fontSize: theme.typography.fontSize["2xl"],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing[2],
  },
  cardSubtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing[8],
  },
  fields: {
    gap: theme.spacing[4],
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    backgroundColor: theme.colors.background.card,
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing[4],
  },
  inputRowFocused: {
    borderColor: theme.colors.primary.DEFAULT,
    backgroundColor: theme.palette.neutral[0],
  },
  inputRowError: {
    borderColor: theme.colors.status.error,
    backgroundColor: "#FEF2F2",
  },
  inputIcon: {
    marginRight: theme.spacing[3],
  },
  inputText: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
  },
  fieldError: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.status.error,
    marginTop: theme.spacing[1],
    marginLeft: theme.spacing[1],
  },
  eyeButton: {
    padding: theme.spacing[2],
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing[4],
    marginBottom: theme.spacing[8],
  },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: theme.radii.xs,
    borderWidth: 1.5,
    borderColor: theme.palette.neutral[300],
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing[2],
  },
  checkboxActive: {
    backgroundColor: theme.colors.primary.DEFAULT,
    borderColor: theme.colors.primary.DEFAULT,
  },
  rememberText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
  },
  forgotText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.DEFAULT,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderRadius: theme.radii.md,
    padding: theme.spacing[3],
    gap: theme.spacing[2],
    marginBottom: theme.spacing[4],
  },
  errorBannerText: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.status.error,
  },
  loginButton: {
    backgroundColor: theme.colors.primary.DEFAULT,
    height: 56,
    borderRadius: theme.radii.xl,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.md,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: theme.palette.neutral[0],
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
  },
});
