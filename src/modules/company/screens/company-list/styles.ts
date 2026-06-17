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
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(12, 0.5),
  },
  backButton: {},
  headerTitle: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
  },
  newButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6, 0.5),
    backgroundColor: theme.palette.neutral[0],
    paddingHorizontal: moderateScale(14, 0.5),
    paddingVertical: moderateScale(8, 0.5),
    borderRadius: 8,
  },
  newButtonText: {
    fontSize: moderateScale(13, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.DEFAULT,
  },
  listContent: {
    paddingHorizontal: moderateScale(20, 0.5),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(32),
    gap: moderateScale(12, 0.5),
  },
  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border.DEFAULT,
    padding: moderateScale(16, 0.5),
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(12, 0.5),
  },
  cardIcon: {
    width: scale(44),
    height: scale(44),
    borderRadius: 22,
    backgroundColor: theme.colors.background.elevated,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    flex: 1,
    gap: moderateScale(4, 0.5),
  },
  cardName: {
    fontSize: moderateScale(15, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  cardDocument: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.secondary,
  },
  cardRight: {
    alignItems: "flex-end",
    gap: moderateScale(6, 0.5),
  },
  badgeActive: {
    backgroundColor: theme.colors.accent.greenLight,
    paddingHorizontal: moderateScale(8, 0.5),
    paddingVertical: moderateScale(3, 0.5),
    borderRadius: 6,
  },
  badgeInactive: {
    backgroundColor: theme.colors.background.elevated,
    paddingHorizontal: moderateScale(8, 0.5),
    paddingVertical: moderateScale(3, 0.5),
    borderRadius: 6,
  },
  badgeActiveText: {
    fontSize: moderateScale(11, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.accent.greenDark,
  },
  badgeInactiveText: {
    fontSize: moderateScale(11, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: verticalScale(80),
    gap: moderateScale(12, 0.5),
  },
  emptyTitle: {
    fontSize: moderateScale(18, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  emptySubtitle: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
    textAlign: "center",
    paddingHorizontal: moderateScale(32, 0.5),
  },
  errorText: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.status.error,
    textAlign: "center",
    paddingTop: verticalScale(40),
  },
});
