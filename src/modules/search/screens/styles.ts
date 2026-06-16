import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },
  searchContainer: {
    backgroundColor: theme.colors.background.DEFAULT,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.DEFAULT,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background.card,
    borderRadius: 12,
    paddingHorizontal: theme.spacing[4],
    paddingVertical: verticalScale(10),
    borderWidth: 1,
    borderColor: theme.colors.border.DEFAULT,
  },
  input: {
    flex: 1,
    fontSize: moderateScale(15, 0.3),
    color: theme.colors.text.primary,
    paddingVertical: 0,
  },

  // Filtros
  filtersRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing[4],
    paddingVertical: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.DEFAULT,
  },
  filtersRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6, 0.5),
  },
  filtersRowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: moderateScale(10, 0.5),
    paddingVertical: verticalScale(6),
    borderRadius: 20,
    backgroundColor: theme.colors.background.elevated,
    borderWidth: 1,
    borderColor: "transparent",
  },
  filterChipActive: {
    backgroundColor: theme.colors.primary.surface,
    borderColor: theme.colors.primary.DEFAULT,
  },
  filterChipText: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.secondary,
  },
  filterChipTextActive: {
    color: theme.colors.primary.DEFAULT,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  filterLabel: {
    fontSize: moderateScale(11, 0.3),
    color: theme.colors.text.tertiary,
  },
  advancedFilters: {
    paddingHorizontal: theme.spacing[4],
    paddingVertical: verticalScale(8),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.DEFAULT,
    gap: verticalScale(8),
  },
  cityFilterRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background.card,
    borderRadius: 10,
    paddingHorizontal: theme.spacing[3],
    paddingVertical: verticalScale(8),
    borderWidth: 1,
    borderColor: theme.colors.border.DEFAULT,
    gap: moderateScale(8, 0.5),
  },
  cityInput: {
    flex: 1,
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.primary,
    paddingVertical: 0,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(8, 0.5),
  },
  categoryChip: {
    paddingHorizontal: moderateScale(14, 0.5),
    paddingVertical: verticalScale(7),
    borderRadius: 20,
    backgroundColor: theme.colors.background.elevated,
    borderWidth: 1,
    borderColor: theme.colors.border.DEFAULT,
    marginRight: moderateScale(8, 0.5),
  },
  categoryChipActive: {
    backgroundColor: theme.colors.primary.DEFAULT,
    borderColor: theme.colors.primary.DEFAULT,
  },
  categoryChipText: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.text.secondary,
  },
  categoryChipTextActive: {
    color: theme.palette.neutral[0],
    fontWeight: theme.typography.fontWeight.semibold,
  },

  listContent: {
    padding: moderateScale(14, 0.5),
    gap: verticalScale(10),
    paddingBottom: verticalScale(40),
  },
  emptyContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: moderateScale(32, 0.5),
  },

  // Card
  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: 14,
    padding: moderateScale(14, 0.5),
    borderWidth: 1,
    borderColor: theme.colors.border.DEFAULT,
    gap: verticalScale(8),
  },
  cardMain: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  cardAvatar: {
    width: moderateScale(44, 0.5),
    height: moderateScale(44, 0.5),
    borderRadius: 22,
    backgroundColor: theme.colors.primary.surface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: moderateScale(10, 0.5),
  },
  cardContent: {
    flex: 1,
  },
  cardRight: {
    alignItems: "flex-end",
    gap: verticalScale(6),
  },
  cardName: {
    fontSize: moderateScale(15, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(3),
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    gap: 3,
  },
  cardRating: {
    fontSize: moderateScale(13, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  cardReviews: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.secondary,
  },
  cardLocation: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.tertiary,
  },

  // Badge
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: moderateScale(8, 0.5),
    paddingVertical: moderateScale(3, 0.5),
    borderRadius: 20,
  },
  badgeAvailable: { backgroundColor: "#DCFCE7" },
  badgeUnavailable: { backgroundColor: theme.colors.background.elevated },
  badgeText: { fontSize: moderateScale(11, 0.3), fontWeight: theme.typography.fontWeight.medium },
  badgeTextAvailable: { color: "#15803D" },
  badgeTextUnavailable: { color: theme.colors.text.tertiary },

  // Services
  servicesRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: moderateScale(6, 0.5),
  },
  serviceChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background.elevated,
    borderRadius: 8,
    paddingHorizontal: moderateScale(8, 0.5),
    paddingVertical: verticalScale(4),
    gap: moderateScale(4, 0.5),
    maxWidth: "48%",
  },
  serviceChipText: {
    fontSize: moderateScale(11, 0.3),
    color: theme.colors.text.secondary,
    flexShrink: 1,
  },
  serviceChipPrice: {
    fontSize: moderateScale(11, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.DEFAULT,
  },
  serviceMore: {
    fontSize: moderateScale(11, 0.3),
    color: theme.colors.text.tertiary,
    alignSelf: "center",
  },

  // Next date
  nextRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  nextDate: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.primary.DEFAULT,
  },

  // States
  loader: { padding: verticalScale(40) },
  footerLoader: { padding: verticalScale(16) },
  errorText: {
    fontSize: moderateScale(15, 0.3),
    color: theme.colors.status.error,
    textAlign: "center",
    padding: verticalScale(40),
  },
  emptyContainer: {
    alignItems: "center",
    gap: verticalScale(10),
  },
  emptyText: {
    fontSize: moderateScale(17, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
});
