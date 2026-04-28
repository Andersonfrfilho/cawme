import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";

export const styles = StyleSheet.create({
  formCard: {
    flex: 1,
    backgroundColor: theme.palette.neutral[0],
    borderTopLeftRadius: theme.radii["3xl"],
    borderTopRightRadius: theme.radii["3xl"],
    marginTop: -theme.radii["3xl"],
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
    marginTop: theme.spacing[2],
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
  secondaryActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing[6],
  },
  secondaryButton: {
    paddingVertical: theme.spacing[2],
    paddingHorizontal: theme.spacing[2],
  },
  secondaryButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing[2],
  },
  secondaryText: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.DEFAULT,
  },
});

export default styles;
