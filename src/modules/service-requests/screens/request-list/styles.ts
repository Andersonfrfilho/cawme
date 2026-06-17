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
    borderColor: theme.palette.neutral[300],
    gap: verticalScale(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(8, 0.5),
  },
  cardAvatar: {
    width: moderateScale(36, 0.5),
    height: moderateScale(36, 0.5),
    borderRadius: 18,
    backgroundColor: theme.colors.primary.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  cardDate: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.secondary,
  },
  cardCode: {
    fontSize: moderateScale(11, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.DEFAULT,
    marginTop: 2,
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
  cardServiceName: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  cardProviderName: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.secondary,
  },
  cardAddress: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.secondary,
    marginTop: 2,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: verticalScale(4),
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.DEFAULT,
  },
  cardMetaLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(8, 0.5),
  },
  cardMetaText: {
    fontSize: moderateScale(15, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary.DEFAULT,
  },
  cardPaymentMethod: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.secondary,
    backgroundColor: theme.colors.background.elevated,
    paddingHorizontal: moderateScale(8, 0.5),
    paddingVertical: verticalScale(2),
    borderRadius: 6,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: theme.colors.background.DEFAULT,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(32),
    maxHeight: "80%" as unknown as number,
  },
  modalHandle: {
    width: moderateScale(40, 0.5),
    height: verticalScale(4),
    borderRadius: 2,
    backgroundColor: theme.colors.border.DEFAULT,
    alignSelf: "center",
    marginBottom: verticalScale(16),
  },
  modalContent: {
    paddingHorizontal: moderateScale(24, 0.5),
    gap: verticalScale(12),
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(4),
  },
  modalTitle: {
    fontSize: moderateScale(18, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: verticalScale(6),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border.DEFAULT,
  },
  detailLabel: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.text.secondary,
  },
  detailValue: {
    fontSize: moderateScale(13, 0.3),
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    maxWidth: "60%",
    textAlign: "right",
  },
  detailSection: {
    paddingTop: verticalScale(4),
  },
  detailSectionTitle: {
    fontSize: moderateScale(13, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: verticalScale(4),
  },
  detailDescription: {
    fontSize: moderateScale(15, 0.3),
    color: theme.colors.text.primary,
    lineHeight: moderateScale(24, 0.3),
    backgroundColor: theme.colors.background.elevated,
    borderRadius: 10,
    padding: moderateScale(12, 0.5),
  },
  detailMapContainer: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: verticalScale(4),
  },
  detailMap: {
    width: "100%",
    height: verticalScale(150),
    borderRadius: 12,
  },
});

export default styles;
