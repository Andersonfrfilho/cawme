import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },
  list: {
    padding: moderateScale(16, 0.5),
    gap: verticalScale(12),
  },
  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: 14,
    padding: moderateScale(14, 0.5),
    borderWidth: 1,
    borderColor: theme.palette.neutral[300],
    gap: verticalScale(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
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
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: moderateScale(8, 0.5),
    paddingVertical: moderateScale(3, 0.5),
    borderRadius: theme.radii.full,
  },
  badgeAvailable: {
    backgroundColor: "#DCFCE7",
  },
  badgeUnavailable: {
    backgroundColor: theme.palette.neutral[100],
  },
  badgeText: {
    fontSize: moderateScale(11, 0.3),
    fontWeight: theme.typography.fontWeight.medium,
  },
  badgeTextAvailable: {
    color: "#15803D",
  },
  badgeTextUnavailable: {
    color: theme.colors.text.tertiary,
  },
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
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: moderateScale(32, 0.5),
  },
  centeredList: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: moderateScale(32, 0.5),
  },
  errorText: {
    fontSize: moderateScale(15, 0.3),
    color: theme.colors.status.error,
    textAlign: "center",
  },
  emptyText: {
    fontSize: moderateScale(15, 0.3),
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  nextAvailableRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(4, 0.5),
  },
  nextAvailableDate: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.primary.DEFAULT,
  },
});
