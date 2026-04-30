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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.radii.lg,
    padding: moderateScale(16, 0.5),
    ...theme.shadows.sm,
  },
  cardAvatar: {
    width: moderateScale(48, 0.5),
    height: moderateScale(48, 0.5),
    borderRadius: moderateScale(24, 0.5),
    backgroundColor: theme.colors.primary.surface,
    justifyContent: "center",
    alignItems: "center",
    marginRight: moderateScale(12, 0.5),
  },
  cardContent: {
    flex: 1,
  },
  cardName: {
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(4),
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(6),
  },
  cardRating: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginLeft: moderateScale(4, 0.5),
  },
  cardReviews: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.text.secondary,
    marginLeft: moderateScale(2, 0.5),
  },
  cardLocation: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.text.tertiary,
    marginLeft: moderateScale(4, 0.5),
  },
  badge: {
    alignSelf: "flex-start",
    paddingHorizontal: moderateScale(8, 0.5),
    paddingVertical: moderateScale(3, 0.5),
    borderRadius: theme.radii.full,
  },
  badgeAvailable: {
    backgroundColor: theme.colors.accent.greenLight,
  },
  badgeUnavailable: {
    backgroundColor: theme.palette.neutral[100],
  },
  badgeText: {
    fontSize: moderateScale(12, 0.3),
    fontWeight: theme.typography.fontWeight.medium,
  },
  badgeTextAvailable: {
    color: theme.colors.accent.greenDark,
  },
  badgeTextUnavailable: {
    color: theme.colors.text.tertiary,
  },
});
