import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },
  container: {
    flex: 1,
    paddingHorizontal: moderateScale(24, 0.5),
    paddingTop: verticalScale(24),
  },
  header: {
    marginBottom: verticalScale(24),
    alignItems: "center",
  },
  headerIcon: {
    width: moderateScale(64, 0.5),
    height: moderateScale(64, 0.5),
    borderRadius: moderateScale(32, 0.5),
    backgroundColor: theme.colors.primary.surface,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  title: {
    fontSize: moderateScale(22, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(8),
  },
  subtitle: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
    lineHeight: moderateScale(20, 0.3),
  },
  documentTypeSection: {
    marginBottom: verticalScale(24),
    alignItems: "center",
  },
  sectionLabel: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(12),
  },
  documentTypesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: moderateScale(8, 0.5),
  },
  documentTypeChip: {
    paddingHorizontal: moderateScale(16, 0.5),
    paddingVertical: verticalScale(10),
    borderRadius: theme.radii.lg,
    backgroundColor: theme.palette.neutral[0],
    borderWidth: 1.5,
    borderColor: theme.palette.neutral[200],
  },
  documentTypeChipSelected: {
    backgroundColor: theme.colors.primary.DEFAULT,
    borderColor: theme.colors.primary.DEFAULT,
  },
  documentTypeChipText: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  documentTypeChipTextSelected: {
    color: theme.palette.neutral[0],
    fontWeight: theme.typography.fontWeight.bold,
  },
  uploadArea: {
    aspectRatio: 16 / 10,
    alignSelf: "stretch",
    backgroundColor: theme.palette.neutral[0],
    borderRadius: theme.radii.lg,
    borderWidth: 2,
    borderColor: theme.palette.neutral[200],
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",

    width: "100%",
    marginBottom: verticalScale(8),
    overflow: "hidden",
  },
  uploadAreaActive: {
    borderColor: theme.colors.primary.DEFAULT,
    backgroundColor: theme.colors.primary.surface,
  },
  uploadAreaHasImage: {
    borderStyle: "solid",
    borderColor: theme.colors.status.success,
  },
  uploadPlaceholder: {
    alignItems: "center",
    padding: moderateScale(24, 0.5),
  },
  uploadIcon: {
    marginBottom: verticalScale(12),
  },
  uploadTitle: {
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(4),
  },
  uploadSubtitle: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  previewOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: moderateScale(12, 0.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  previewOverlayText: {
    fontSize: moderateScale(13, 0.3),
    color: theme.palette.neutral[0],
    fontWeight: theme.typography.fontWeight.medium,
  },
  removeButton: {
    padding: moderateScale(4, 0.5),
  },
  guidelinesCard: {
    backgroundColor: theme.palette.neutral[0],
    borderRadius: theme.radii.lg,
    padding: moderateScale(16, 0.5),
    marginBottom: verticalScale(24),
    borderWidth: 1,
    borderColor: theme.palette.neutral[100],
  },
  guidelinesTitle: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(10),
  },
  guidelineItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(8),
  },
  guidelineIcon: {
    marginRight: moderateScale(10, 0.5),
  },
  guidelineText: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.text.secondary,
  },
  statusSection: {
    marginBottom: verticalScale(24),
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.palette.neutral[0],
    borderRadius: theme.radii.lg,
    padding: moderateScale(16, 0.5),
    borderWidth: 1,
    borderColor: theme.palette.neutral[100],
  },
  statusIconContainer: {
    width: moderateScale(40, 0.5),
    height: moderateScale(40, 0.5),
    borderRadius: moderateScale(20, 0.5),
    justifyContent: "center",
    alignItems: "center",
    marginRight: moderateScale(12, 0.5),
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.secondary,
    marginBottom: verticalScale(2),
  },
  statusValue: {
    fontSize: moderateScale(15, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  errorCard: {
    backgroundColor: theme.palette.error[50],
    borderRadius: theme.radii.lg,
    padding: moderateScale(16, 0.5),
    marginBottom: verticalScale(16),
    borderWidth: 1,
    borderColor: theme.palette.error[300],
  },
  errorText: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.status.error,
    textAlign: "center",
  },
  footer: {
    paddingVertical: verticalScale(16),
  },
  submitButton: {
    backgroundColor: theme.colors.primary.DEFAULT,
    height: verticalScale(56),
    borderRadius: theme.radii.xl,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: theme.colors.primary.DEFAULT,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.palette.neutral[0],
  },
  skipButton: {
    height: verticalScale(48),
    justifyContent: "center",
    alignItems: "center",
    marginTop: verticalScale(8),
  },
  skipButtonText: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
    textDecorationLine: "underline",
  },
  providerMandatoryContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: verticalScale(16),
    paddingHorizontal: moderateScale(16, 0.5),
    paddingVertical: verticalScale(12),
    backgroundColor: theme.colors.background.elevated,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.status.warning,
  },
  providerMandatoryText: {
    flex: 1,
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.text.secondary,
    lineHeight: moderateScale(18, 0.3),
  },
});
