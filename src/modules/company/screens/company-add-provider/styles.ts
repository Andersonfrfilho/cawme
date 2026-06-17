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
    paddingBottom: verticalScale(16),
    paddingHorizontal: moderateScale(24, 0.5),
    gap: moderateScale(12, 0.5),
  },
  headerRow: {
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
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.palette.neutral[0],
    borderRadius: 10,
    paddingHorizontal: moderateScale(12, 0.5),
    height: verticalScale(44),
    gap: moderateScale(8, 0.5),
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.primary,
  },
  listContent: {
    paddingHorizontal: moderateScale(20, 0.5),
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(32),
    gap: moderateScale(10, 0.5),
  },
  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border.DEFAULT,
    padding: moderateScale(14, 0.5),
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(12, 0.5),
  },
  cardAvatar: {
    width: scale(40),
    height: scale(40),
    borderRadius: 20,
    backgroundColor: theme.colors.background.elevated,
    alignItems: "center",
    justifyContent: "center",
  },
  cardBody: {
    flex: 1,
    gap: moderateScale(3, 0.5),
  },
  cardName: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  cardServices: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.secondary,
  },
  cardLocation: {
    fontSize: moderateScale(11, 0.3),
    color: theme.colors.text.tertiary,
  },
  emptyContainer: {
    alignItems: "center",
    paddingTop: verticalScale(60),
    gap: moderateScale(12, 0.5),
  },
  emptyText: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
});
