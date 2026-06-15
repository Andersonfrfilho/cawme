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
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: moderateScale(16, 0.5),
    paddingTop: verticalScale(20),
    paddingBottom: verticalScale(48),
    gap: verticalScale(16),
  },
  calendarCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: 16,
    padding: moderateScale(16, 0.5),
    borderWidth: 1,
    borderColor: theme.colors.border.DEFAULT,
  },
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(16),
  },
  navButton: {
    padding: moderateScale(4, 0.5),
  },
  monthLabel: {
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  weekDayRow: {
    flexDirection: "row",
    marginBottom: verticalScale(4),
  },
  weekDayLabel: {
    flex: 1,
    textAlign: "center",
    fontSize: moderateScale(12, 0.3),
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.tertiary,
    paddingVertical: verticalScale(4),
  },
  gridRow: {
    flexDirection: "row",
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: verticalScale(2),
    borderRadius: theme.radii.full,
    margin: moderateScale(2, 0.5),
  },
  dayCellSelected: {
    backgroundColor: theme.colors.primary.DEFAULT,
  },
  dayCellToday: {
    backgroundColor: theme.colors.primary.surface,
  },
  dayNumber: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.text.primary,
  },
  dayNumberSelected: {
    color: theme.palette.neutral[0],
    fontWeight: theme.typography.fontWeight.semibold,
  },
  dayNumberToday: {
    color: theme.colors.primary.DEFAULT,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  dot: {
    width: moderateScale(4, 0.5),
    height: moderateScale(4, 0.5),
    borderRadius: theme.radii.full,
    backgroundColor: theme.colors.primary.DEFAULT,
  },
  dotSelected: {
    backgroundColor: theme.palette.neutral[0],
  },
  appointmentsSection: {
    gap: verticalScale(12),
  },
  appointmentsTitle: {
    fontSize: moderateScale(15, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: verticalScale(32),
    gap: verticalScale(12),
  },
  emptyText: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  appointmentCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: 14,
    padding: moderateScale(14, 0.5),
    borderWidth: 1,
    borderColor: theme.colors.border.DEFAULT,
    gap: verticalScale(6),
  },
  appointmentTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  appointmentTime: {
    fontSize: moderateScale(15, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  statusBadge: {
    borderRadius: 20,
    paddingVertical: verticalScale(3),
    paddingHorizontal: moderateScale(10, 0.5),
  },
  statusText: {
    fontSize: moderateScale(11, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
  },
  appointmentId: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.secondary,
  },
  appointmentDescription: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.text.primary,
    lineHeight: moderateScale(20, 0.3),
  },
});
