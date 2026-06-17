import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },
  subtitle: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.text.secondary,
    paddingHorizontal: moderateScale(20, 0.5),
    paddingTop: moderateScale(16, 0.5),
    paddingBottom: moderateScale(8, 0.5),
  },
  loader: {
    marginTop: verticalScale(40),
  },
  listContent: {
    paddingHorizontal: moderateScale(16, 0.5),
    paddingBottom: verticalScale(80),
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background.card,
    borderRadius: 14,
    padding: moderateScale(14, 0.5),
    marginBottom: moderateScale(10, 0.5),
    borderWidth: 1,
    borderColor: theme.colors.border.DEFAULT,
  },
  locationInfo: {
    flex: 1,
  },
  primaryBadge: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: 6,
    paddingHorizontal: moderateScale(8, 0.5),
    paddingVertical: moderateScale(2, 0.5),
    marginBottom: moderateScale(4, 0.5),
  },
  primaryBadgeText: {
    fontSize: moderateScale(10, 0.3),
    color: theme.palette.neutral[0],
    fontWeight: "600",
  },
  locationCity: {
    fontSize: moderateScale(15, 0.3),
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  locationStreet: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.secondary,
    marginTop: moderateScale(2, 0.5),
  },
  removeButton: {
    padding: moderateScale(8, 0.5),
  },
  emptyText: {
    textAlign: "center",
    color: theme.colors.text.tertiary,
    fontSize: moderateScale(14, 0.3),
    marginTop: verticalScale(40),
  },
  addButton: {
    position: "absolute",
    bottom: verticalScale(24),
    left: moderateScale(20, 0.5),
    right: moderateScale(20, 0.5),
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: 14,
    paddingVertical: verticalScale(15),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(8, 0.5),
  },
  addButtonText: {
    fontSize: moderateScale(15, 0.3),
    fontWeight: "700",
    color: theme.palette.neutral[0],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: theme.colors.background.DEFAULT,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: moderateScale(20, 0.5),
    maxHeight: "70%",
  },
  modalTitle: {
    fontSize: moderateScale(17, 0.3),
    fontWeight: "700",
    color: theme.colors.text.primary,
    marginBottom: moderateScale(16, 0.5),
    textAlign: "center",
  },
  addressOption: {
    padding: moderateScale(14, 0.5),
    borderRadius: 12,
    backgroundColor: theme.colors.background.elevated,
    marginBottom: moderateScale(8, 0.5),
    borderWidth: 1,
    borderColor: theme.colors.border.DEFAULT,
  },
  addressOptionDisabled: {
    opacity: 0.5,
  },
  addressOptionCity: {
    fontSize: moderateScale(15, 0.3),
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  addressOptionStreet: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.secondary,
    marginTop: moderateScale(2, 0.5),
  },
  cancelButton: {
    marginTop: moderateScale(12, 0.5),
    paddingVertical: verticalScale(14),
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: moderateScale(15, 0.3),
    color: theme.colors.text.secondary,
  },
});
