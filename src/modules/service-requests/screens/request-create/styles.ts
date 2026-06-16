import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },
  header: {
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingTop: verticalScale(24),
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
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: moderateScale(24, 0.5),
    paddingTop: verticalScale(32),
    paddingBottom: verticalScale(48),
    gap: moderateScale(24, 0.5),
  },
  providerCard: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: 14,
    paddingVertical: verticalScale(16),
    paddingHorizontal: moderateScale(16, 0.5),
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(12, 0.5),
    borderWidth: 1,
    borderColor: theme.colors.border.DEFAULT,
  },
  providerAvatarPlaceholder: {
    width: moderateScale(44, 0.5),
    height: moderateScale(44, 0.5),
    borderRadius: 22,
    backgroundColor: theme.colors.primary.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  providerAvatar: {
    width: moderateScale(44, 0.5),
    height: moderateScale(44, 0.5),
    borderRadius: 22,
  },
  providerName: {
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  providerSubtitle: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.secondary,
    marginTop: verticalScale(2),
  },
  fieldGroup: {
    gap: verticalScale(8),
  },
  label: {
    fontSize: moderateScale(13, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  selectorButton: {
    height: verticalScale(52),
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
    paddingHorizontal: moderateScale(16, 0.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.background.elevated,
  },
  selectorButtonSelected: {
    borderColor: theme.colors.primary.DEFAULT,
  },
  selectorText: {
    fontSize: moderateScale(15, 0.3),
    color: theme.colors.text.secondary,
    flex: 1,
  },
  selectorTextSelected: {
    color: theme.colors.text.primary,
  },
  descriptionInput: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
    paddingHorizontal: moderateScale(16, 0.5),
    paddingVertical: verticalScale(14),
    fontSize: moderateScale(15, 0.3),
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.elevated,
    minHeight: verticalScale(100),
    textAlignVertical: "top",
  },
  descriptionInputFocused: {
    borderColor: theme.colors.primary.DEFAULT,
  },
  errorText: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.status.error,
    marginTop: verticalScale(2),
  },
  submitButton: {
    height: verticalScale(52),
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(8),
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
  },
  // Selected services summary
  selectedServicesList: {
    gap: verticalScale(8),
    marginTop: verticalScale(4),
  },
  selectedServiceItem: {
    backgroundColor: theme.colors.background.elevated,
    borderWidth: 1.5,
    borderColor: theme.colors.primary.DEFAULT,
    borderRadius: 12,
    paddingHorizontal: moderateScale(16, 0.5),
    paddingVertical: verticalScale(12),
    gap: verticalScale(8),
  },
  selectedServiceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedServiceName: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    flex: 1,
    marginRight: moderateScale(8, 0.5),
  },
  selectedServiceUnit: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.primary.DEFAULT,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  hoursRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  hoursLabelText: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.text.secondary,
  },
  stepperRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(12, 0.5),
  },
  stepperButton: {
    width: moderateScale(30, 0.5),
    height: moderateScale(30, 0.5),
    borderRadius: 15,
    backgroundColor: theme.colors.primary.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperButtonText: {
    fontSize: moderateScale(18, 0.3),
    color: theme.palette.neutral[0],
    fontWeight: theme.typography.fontWeight.bold,
    lineHeight: moderateScale(20, 0.3),
  },
  stepperValue: {
    fontSize: moderateScale(15, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    minWidth: moderateScale(36, 0.5),
    textAlign: "center",
  },
  estimatedRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  estimatedText: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.secondary,
  },
  estimatedPrice: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.primary.DEFAULT,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  // Modal confirm button
  modalConfirmButton: {
    marginHorizontal: moderateScale(24, 0.5),
    marginTop: verticalScale(8),
    marginBottom: verticalScale(4),
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: 12,
    paddingVertical: verticalScale(14),
    alignItems: "center",
  },
  modalConfirmButtonText: {
    fontSize: moderateScale(15, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
  },
  // Modal picker
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: theme.colors.background.DEFAULT,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(32),
    maxHeight: "70%" as unknown as number,
  },
  modalHandle: {
    width: moderateScale(40, 0.5),
    height: verticalScale(4),
    borderRadius: 2,
    backgroundColor: theme.colors.border.DEFAULT,
    alignSelf: "center",
    marginBottom: verticalScale(16),
  },
  modalTitle: {
    fontSize: moderateScale(17, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    paddingHorizontal: moderateScale(24, 0.5),
    marginBottom: verticalScale(8),
  },
  optionItem: {
    paddingVertical: verticalScale(14),
    paddingHorizontal: moderateScale(24, 0.5),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  optionItemSelected: {
    backgroundColor: theme.colors.primary.surface,
  },
  optionText: {
    fontSize: moderateScale(15, 0.3),
    color: theme.colors.text.primary,
    flex: 1,
  },
  optionSubtext: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.text.secondary,
    marginTop: verticalScale(2),
  },
  optionPrice: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.DEFAULT,
  },
  // Date picker
  datePickerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(8, 0.5),
    marginTop: verticalScale(8),
    marginBottom: verticalScale(8),
  },
  datePickerColumnWrapper: {
    flex: 1,
    alignItems: "center",
    overflow: "hidden",
  },
  datePickerHighlight: {
    position: "absolute",
    left: moderateScale(8, 0.5),
    right: moderateScale(8, 0.5),
    height: verticalScale(44),
    borderRadius: 8,
    backgroundColor: theme.colors.primary.surface,
    borderWidth: 1,
    borderColor: theme.colors.primary.DEFAULT,
  },
  datePickerItem: {
    justifyContent: "center",
    alignItems: "center",
    height: verticalScale(44),
  },
  datePickerItemText: {
    fontSize: moderateScale(15, 0.3),
    color: theme.colors.text.secondary,
  },
  datePickerItemTextSelected: {
    fontSize: moderateScale(17, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.DEFAULT,
  },
  datePickerSeparator: {
    fontSize: moderateScale(18, 0.3),
    color: theme.colors.text.secondary,
    marginHorizontal: moderateScale(4, 0.5),
  },
});

export default styles;
