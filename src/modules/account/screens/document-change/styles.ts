import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, scale, verticalScale } from "@/shared/utils/scale";

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
    paddingTop: verticalScale(32),
  },
  fieldGroup: {
    gap: moderateScale(10, 0.5),
    marginBottom: moderateScale(24, 0.5),
  },
  label: {
    fontSize: moderateScale(13, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    height: verticalScale(52),
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
    paddingHorizontal: moderateScale(16, 0.5),
    fontSize: moderateScale(15, 0.3),
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.elevated,
  },
  inputFocused: {
    borderColor: theme.colors.primary.DEFAULT,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: moderateScale(8, 0.5),
  },
  chip: {
    paddingHorizontal: moderateScale(16, 0.5),
    paddingVertical: verticalScale(8),
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
    backgroundColor: theme.colors.background.elevated,
  },
  chipSelected: {
    borderColor: theme.colors.primary.DEFAULT,
    backgroundColor: theme.colors.primary.DEFAULT,
  },
  chipText: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  chipTextSelected: {
    color: theme.palette.neutral[0],
    fontWeight: theme.typography.fontWeight.bold,
  },
  uploadRow: {
    flexDirection: "row",
    gap: moderateScale(12, 0.5),
  },
  uploadButton: {
    flex: 1,
    height: verticalScale(52),
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.primary.DEFAULT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(6, 0.5),
    backgroundColor: theme.colors.background.elevated,
  },
  uploadButtonText: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.primary.DEFAULT,
    fontWeight: theme.typography.fontWeight.medium,
  },
  filePreview: {
    marginTop: verticalScale(8),
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  imagePreview: {
    width: "100%",
    height: verticalScale(180),
    borderRadius: 12,
  },
  pdfPreview: {
    height: verticalScale(80),
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
    backgroundColor: theme.colors.background.elevated,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(16, 0.5),
    gap: moderateScale(12, 0.5),
  },
  fileName: {
    flex: 1,
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.primary,
  },
  removeFile: {
    position: "absolute",
    top: moderateScale(8, 0.5),
    right: moderateScale(8, 0.5),
  },
  saveButton: {
    height: verticalScale(52),
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(8),
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
  },
});
