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
    paddingTop: verticalScale(32),
  },
  fieldGroup: {
    gap: moderateScale(6, 0.5),
    marginBottom: moderateScale(20, 0.5),
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
  row: {
    flexDirection: "row",
    gap: moderateScale(12, 0.5),
  },
  fieldFlex: {
    flex: 1,
  },
  fieldFlexLarge: {
    flex: 2,
  },
  fieldSmall: {
    flex: 1,
    gap: moderateScale(6, 0.5),
    marginBottom: moderateScale(20, 0.5),
  },
  inputFlex: {
    flex: 1,
  },
  cepRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cepSpinner: {
    marginLeft: moderateScale(8, 0.5),
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
