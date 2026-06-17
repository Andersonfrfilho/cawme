import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },
  content: {
    padding: moderateScale(20, 0.5),
    paddingBottom: verticalScale(40),
  },
  label: {
    fontSize: moderateScale(13, 0.3),
    fontWeight: "600",
    color: theme.colors.text.secondary,
    marginBottom: moderateScale(6, 0.5),
    marginTop: moderateScale(16, 0.5),
  },
  input: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border.DEFAULT,
    paddingHorizontal: moderateScale(14, 0.5),
    paddingVertical: moderateScale(12, 0.5),
    fontSize: moderateScale(15, 0.3),
    color: theme.colors.text.primary,
    height: verticalScale(52),
  },
  textarea: {
    height: verticalScale(110),
    paddingTop: moderateScale(12, 0.5),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: moderateScale(20, 0.5),
    paddingVertical: moderateScale(12, 0.5),
    paddingHorizontal: moderateScale(14, 0.5),
    backgroundColor: theme.colors.background.elevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border.DEFAULT,
  },
  ratingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: moderateScale(20, 0.5),
    paddingVertical: moderateScale(12, 0.5),
    paddingHorizontal: moderateScale(14, 0.5),
    backgroundColor: theme.colors.background.elevated,
    borderRadius: 12,
  },
  ratingLabel: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
  },
  ratingValue: {
    fontSize: moderateScale(15, 0.3),
    fontWeight: "700",
    color: theme.colors.text.primary,
  },
  saveButton: {
    marginTop: moderateScale(28, 0.5),
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: 14,
    paddingVertical: verticalScale(16),
    alignItems: "center",
  },
  saveButtonDisabled: {
    opacity: 0.4,
  },
  saveButtonText: {
    fontSize: moderateScale(15, 0.3),
    fontWeight: "700",
    color: theme.palette.neutral[0],
  },
});

export default styles;
