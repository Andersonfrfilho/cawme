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
    gap: moderateScale(12, 0.5),
  },
  backButton: {},
  headerTitleBlock: {
    flex: 1,
  },
  headerTitle: {
    fontSize: moderateScale(18, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
  },
  headerSubtitle: {
    fontSize: moderateScale(12, 0.3),
    color: theme.palette.neutral[0],
    opacity: 0.8,
    marginTop: moderateScale(2, 0.5),
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: moderateScale(20, 0.5),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(40),
    gap: moderateScale(20, 0.5),
  },
  infoCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border.DEFAULT,
    padding: moderateScale(16, 0.5),
    gap: moderateScale(12, 0.5),
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(10, 0.5),
  },
  infoText: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.primary,
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: moderateScale(13, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4, 0.5),
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingHorizontal: moderateScale(12, 0.5),
    paddingVertical: moderateScale(6, 0.5),
    borderRadius: 8,
  },
  addButtonText: {
    fontSize: moderateScale(12, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.palette.neutral[0],
  },
  listCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border.DEFAULT,
    overflow: "hidden",
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(16, 0.5),
    paddingVertical: moderateScale(12, 0.5),
    gap: moderateScale(10, 0.5),
  },
  listItemSeparator: {
    height: 1,
    backgroundColor: theme.colors.border.DEFAULT,
    marginHorizontal: moderateScale(16, 0.5),
  },
  listItemIcon: {
    width: scale(36),
    height: scale(36),
    borderRadius: 18,
    backgroundColor: theme.colors.background.elevated,
    alignItems: "center",
    justifyContent: "center",
  },
  listItemBody: {
    flex: 1,
    gap: moderateScale(2, 0.5),
  },
  listItemTitle: {
    fontSize: moderateScale(13, 0.3),
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  listItemSubtitle: {
    fontSize: moderateScale(11, 0.3),
    color: theme.colors.text.secondary,
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
  emptyText: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.text.tertiary,
    textAlign: "center",
    paddingVertical: moderateScale(20, 0.5),
  },
  errorText: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.status.error,
    textAlign: "center",
    paddingTop: verticalScale(40),
  },
});
