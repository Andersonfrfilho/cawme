import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },
  header: {
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingBottom: verticalScale(24),
    paddingHorizontal: moderateScale(24, 0.5),
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: moderateScale(12, 0.5),
  },
  headerTitle: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
  },
  content: {
    flex: 1,
    paddingHorizontal: moderateScale(24, 0.5),
    paddingTop: verticalScale(24),
  },
  emptyText: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginTop: verticalScale(32),
  },
  documentCard: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border.DEFAULT,
    marginBottom: moderateScale(12, 0.5),
    overflow: "hidden",
  },
  documentCardBody: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(16, 0.5),
    paddingTop: verticalScale(14),
    paddingBottom: verticalScale(12),
    gap: moderateScale(12, 0.5),
  },
  documentInfo: {
    flex: 1,
    gap: moderateScale(4, 0.5),
  },
  documentTypeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6, 0.5),
  },
  documentType: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  documentNumber: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.text.secondary,
    fontFamily: "monospace" as any,
    letterSpacing: 0.5,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4, 0.5),
  },
  statusText: {
    fontSize: moderateScale(12, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
  },
  uploadDate: {
    fontSize: moderateScale(11, 0.3),
    color: theme.colors.text.tertiary,
  },
  previewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4, 0.5),
    paddingHorizontal: moderateScale(10, 0.5),
    paddingVertical: moderateScale(6, 0.5),
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: theme.colors.primary.DEFAULT,
    backgroundColor: theme.colors.background.elevated,
    minWidth: moderateScale(44, 0.5),
    justifyContent: "center",
  },
  previewButtonText: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.primary.DEFAULT,
    fontWeight: theme.typography.fontWeight.medium,
  },
  cardDivider: {
    height: 1,
    backgroundColor: theme.colors.border.DEFAULT,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(6, 0.5),
    paddingVertical: verticalScale(10),
  },
  deleteButtonDisabled: {
    opacity: 0.35,
  },
  deleteButtonText: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.status.error,
    fontWeight: theme.typography.fontWeight.medium,
  },
  deleteButtonTextDisabled: {
    color: theme.colors.text.tertiary,
  },
  addButton: {
    height: verticalScale(52),
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(8, 0.5),
    marginTop: verticalScale(8),
  },
  addButtonText: {
    fontSize: moderateScale(15, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
  },
  // preview image modal
  previewOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.92)",
    alignItems: "center",
    justifyContent: "center",
  },
  previewClose: {
    position: "absolute",
    top: verticalScale(56),
    right: moderateScale(20, 0.5),
    zIndex: 1,
  },
  previewImage: {
    width: "90%",
    height: "70%",
    borderRadius: 12,
  },
});
