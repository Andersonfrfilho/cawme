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
  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background.elevated,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.border.DEFAULT,
    marginBottom: moderateScale(12, 0.5),
    paddingHorizontal: moderateScale(16, 0.5),
    paddingVertical: verticalScale(14),
    gap: moderateScale(12, 0.5),
  },
  addressInfo: {
    flex: 1,
    gap: moderateScale(4, 0.5),
  },
  addressLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6, 0.5),
  },
  addressLabel: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  addressText: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.text.secondary,
    lineHeight: moderateScale(18, 0.3),
  },
  deleteButton: {
    padding: moderateScale(4, 0.5),
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
});
