import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale, scale } from "@/shared/utils/scale";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: moderateScale(32, 0.5),
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: verticalScale(16),
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
  },
  iconContainer: {
    width: moderateScale(120, 0.5),
    height: moderateScale(120, 0.5),
    borderRadius: moderateScale(60, 0.5),
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(24),
  },
  title: {
    fontSize: moderateScale(22, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    textAlign: "center",
    marginBottom: verticalScale(12),
  },
  messageCard: {
    width: "100%",
    backgroundColor: theme.palette.neutral[0],
    borderRadius: theme.radii.lg,
    padding: moderateScale(20, 0.5),
    marginBottom: verticalScale(24),
    borderWidth: 1,
    borderColor: theme.palette.neutral[100],
    alignItems: "center",
  },
  reasonBadge: {
    backgroundColor: theme.palette.error[50],
    paddingHorizontal: moderateScale(12, 0.5),
    paddingVertical: verticalScale(4),
    borderRadius: theme.radii.md,
    marginBottom: verticalScale(12),
  },
  reasonBadgeText: {
    fontSize: moderateScale(12, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.status.error,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  messageText: {
    fontSize: moderateScale(15, 0.3),
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: moderateScale(22, 0.3),
  },
  retryText: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.status.warning,
    textAlign: "center",
    marginTop: verticalScale(12),
  },
  actionsContainer: {
    width: "100%",
    gap: verticalScale(12),
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(8, 0.5),
    height: verticalScale(56),
    borderRadius: theme.radii.xl,
    paddingHorizontal: moderateScale(24, 0.5),
    width: "100%",
  },
  actionButtonPrimary: {
    backgroundColor: theme.colors.primary.DEFAULT,
    shadowColor: theme.colors.primary.DEFAULT,
    shadowOffset: { width: 0, height: verticalScale(4) },
    shadowOpacity: 0.3,
    shadowRadius: moderateScale(12, 0.5),
    elevation: scale(6),
  },
  actionButtonOutline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: theme.palette.neutral[300],
  },
  actionButtonSecondary: {
    backgroundColor: theme.palette.neutral[100],
  },
  actionIcon: {
    marginRight: moderateScale(4, 0.5),
  },
  actionButtonText: {
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
  },
  actionButtonTextPrimary: {
    color: theme.palette.neutral[0],
  },
  actionButtonTextOutline: {
    color: theme.colors.text.primary,
  },
  actionButtonTextSecondary: {
    color: theme.colors.text.primary,
  },

  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.colors.background.DEFAULT,
    borderTopLeftRadius: theme.radii.xl,
    borderTopRightRadius: theme.radii.xl,
    paddingHorizontal: moderateScale(24, 0.5),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(32),
    maxHeight: "80%",
  },
  modalHeader: {
    alignItems: "flex-end",
    marginBottom: verticalScale(16),
  },
  modalTitle: {
    fontSize: moderateScale(18, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(8),
  },
  modalSubtitle: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
    marginBottom: verticalScale(24),
  },
  codeInputsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(24),
    gap: moderateScale(12, 0.5),
  },
  codeInput: {
    flex: 1,
    height: verticalScale(56),
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
    borderRadius: theme.radii.lg,
    fontSize: moderateScale(24, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: "center",
    color: theme.colors.text.primary,
  },
  errorText: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.status.error,
    marginBottom: verticalScale(16),
    textAlign: "center",
  },
  modalButton: {
    height: verticalScale(56),
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: theme.radii.lg,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  modalButtonDisabled: {
    opacity: 0.65,
  },
  modalButtonText: {
    color: theme.palette.neutral[0],
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
  },
});
