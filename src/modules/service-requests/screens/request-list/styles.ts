import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },
  header: {
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingTop: verticalScale(24),
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
    gap: moderateScale(12, 0.5),
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: moderateScale(40, 0.5),
    gap: verticalScale(12),
  },
  emptyTitle: {
    fontSize: moderateScale(17, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: moderateScale(21, 0.3),
  },
  card: {
    backgroundColor: theme.colors.background.card,
    borderRadius: 14,
    padding: moderateScale(16, 0.5),
    borderWidth: 1,
    borderColor: theme.colors.border.DEFAULT,
    gap: verticalScale(10),
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardDate: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.secondary,
  },
  statusBadge: {
    borderRadius: 20,
    paddingVertical: verticalScale(4),
    paddingHorizontal: moderateScale(10, 0.5),
  },
  statusBadgePending: {
    backgroundColor: "#FFF7ED",
  },
  statusBadgeAccepted: {
    backgroundColor: "#F0FDF4",
  },
  statusBadgeRejected: {
    backgroundColor: "#FEF2F2",
  },
  statusBadgeCompleted: {
    backgroundColor: "#EFF6FF",
  },
  statusBadgeCancelled: {
    backgroundColor: theme.colors.background.elevated,
  },
  statusText: {
    fontSize: moderateScale(11, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
  },
  statusTextPending: {
    color: "#C2410C",
  },
  statusTextAccepted: {
    color: "#15803D",
  },
  statusTextRejected: {
    color: "#B91C1C",
  },
  statusTextCompleted: {
    color: "#1D4ED8",
  },
  statusTextCancelled: {
    color: theme.colors.text.secondary,
  },
  cardBody: {
    gap: verticalScale(4),
  },
  cardServiceId: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.text.secondary,
  },
  cardDescription: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.primary,
    lineHeight: moderateScale(21, 0.3),
  },
  cardActions: {
    flexDirection: "row",
    gap: moderateScale(8, 0.5),
    marginTop: verticalScale(4),
  },
  actionButton: {
    flex: 1,
    height: verticalScale(40),
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    borderWidth: 1.5,
    borderColor: theme.colors.status.error,
    backgroundColor: "transparent",
  },
  cancelButtonText: {
    fontSize: moderateScale(13, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.status.error,
  },
  acceptButton: {
    backgroundColor: theme.colors.accent.green,
  },
  acceptButtonText: {
    fontSize: moderateScale(13, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.palette.neutral[0],
  },
  rejectButton: {
    borderWidth: 1.5,
    borderColor: theme.colors.text.secondary,
    backgroundColor: "transparent",
  },
  rejectButtonText: {
    fontSize: moderateScale(13, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
  },
  completeButton: {
    backgroundColor: theme.colors.primary.DEFAULT,
  },
  completeButtonText: {
    fontSize: moderateScale(13, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.palette.neutral[0],
  },
});

export default styles;
