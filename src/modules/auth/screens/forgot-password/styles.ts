import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // ── Back navigation ───────────────────────────────
  backNav: {
    width: 40,
    height: 40,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.background.card,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: theme.spacing[5],
    marginTop: theme.spacing[2],
    marginBottom: theme.spacing[1],
    ...theme.shadows.sm,
  },

  // ── Main content ──────────────────────────────────
  content: {
    paddingHorizontal: theme.spacing[7],
    paddingTop: theme.spacing[4],
    paddingBottom: theme.spacing[10],
  },
  iconArea: {
    alignItems: "flex-start",
    marginBottom: theme.spacing[7],
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: theme.radii.xl,
    backgroundColor: theme.colors.primary.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: theme.typography.fontSize["2xl"],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    letterSpacing: theme.typography.letterSpacing.tight,
    marginBottom: theme.spacing[2],
  },
  subtitle: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    lineHeight: 22,
    marginBottom: theme.spacing[8],
  },

  // ── Fields ────────────────────────────────────────
  fields: {
    gap: theme.spacing[3.5],
    marginBottom: theme.spacing[7],
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
    backgroundColor: theme.colors.background.card,
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
    borderRadius: theme.radii.lg,
  },
  inputRowFocused: {
    borderColor: theme.colors.border.focus,
    backgroundColor: theme.colors.primary.surface,
  },
  inputRowError: {
    borderColor: theme.colors.border.error,
    backgroundColor: theme.palette.error[50],
  },
  inputIcon: {
    marginHorizontal: theme.spacing[3.5],
  },
  inputText: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.primary,
    paddingRight: theme.spacing[4],
  },
  fieldError: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.status.error,
    marginTop: -theme.spacing[2],
    marginLeft: theme.spacing[1],
  },

  // ── Error banner ──────────────────────────────────
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.palette.error[50],
    borderWidth: 1,
    borderColor: theme.palette.error[300],
    borderRadius: theme.radii.md,
    paddingHorizontal: theme.spacing[3.5],
    paddingVertical: theme.spacing[3],
    gap: theme.spacing[2],
    marginTop: -theme.spacing[1],
  },
  errorBannerText: {
    flex: 1,
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.status.error,
    lineHeight: 18,
  },

  // ── Submit button ─────────────────────────────────
  submitButton: {
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: theme.radii.lg,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.lg,
  },
  submitButtonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: theme.palette.neutral[0],
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 0.3,
  },

  // ── Success state ─────────────────────────────────
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: theme.spacing[9],
    paddingBottom: theme.spacing[10],
  },
  successIconWrapper: {
    marginBottom: theme.spacing[7],
  },
  successTitle: {
    fontSize: theme.typography.fontSize["2xl"],
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: "center",
    letterSpacing: theme.typography.letterSpacing.tight,
    marginBottom: theme.spacing[3],
  },
  successText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: theme.spacing[10],
  },
  backButton: {
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: theme.radii.lg,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    ...theme.shadows.lg,
  },
  backButtonText: {
    color: theme.palette.neutral[0],
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    letterSpacing: 0.3,
  },
});
