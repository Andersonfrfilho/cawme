import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

export const styles = StyleSheet.create({
  // Card
  requestCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: 12,
    padding: moderateScale(12, 0.5),
    borderWidth: 1,
    borderColor: theme.palette.neutral[300],
    gap: verticalScale(6),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  cardInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  statusChip: {
    paddingHorizontal: moderateScale(8, 0.5),
    paddingVertical: verticalScale(3),
    borderRadius: 8,
  },
  statusChipText: {
    fontSize: moderateScale(11, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(10, 0.5),
    paddingVertical: verticalScale(4),
    borderRadius: 20,
    gap: 5,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  statusPillText: {
    fontSize: moderateScale(12, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
  },
  personName: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.secondary,
  },
  addressLine: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.secondary,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: verticalScale(4),
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.DEFAULT,
  },
  pillsRow: {
    flexDirection: "row",
    gap: 6,
  },
  pricePill: {
    backgroundColor: theme.colors.accent.green + "15",
    paddingHorizontal: moderateScale(8, 0.5),
    paddingVertical: verticalScale(3),
    borderRadius: 6,
  },
  pricePillText: {
    fontSize: moderateScale(13, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.accent.green,
  },
  paymentPill: {
    backgroundColor: theme.colors.primary.surface,
    paddingHorizontal: moderateScale(8, 0.5),
    paddingVertical: verticalScale(3),
    borderRadius: 6,
  },
  paymentPillText: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.primary.DEFAULT,
  },
  scheduleDate: {
    fontSize: moderateScale(11, 0.3),
    color: theme.colors.text.tertiary,
  },

  // Modal
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
    maxHeight: "85%" as unknown as number,
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
    paddingHorizontal: moderateScale(20, 0.5),
    gap: verticalScale(16),
  },

  // Hero
  modalHero: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  heroLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: theme.colors.primary.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  heroAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  heroTitle: {
    fontSize: moderateScale(17, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  heroSubtitle: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.text.secondary,
    marginTop: 2,
  },

  // Info Grid
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  infoCard: {
    width: "47%",
    backgroundColor: theme.colors.background.elevated,
    borderRadius: 12,
    padding: moderateScale(12, 0.5),
    gap: 4,
  },
  infoCardLabel: {
    fontSize: moderateScale(11, 0.3),
    color: theme.colors.text.tertiary,
    fontWeight: theme.typography.fontWeight.medium,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 4,
  },
  infoCardValue: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  infoCardSub: {
    fontSize: moderateScale(11, 0.3),
    color: theme.colors.text.tertiary,
    marginTop: 2,
  },

  // Detail blocks
  detailBlock: {
    gap: verticalScale(8),
  },
  blockTitle: {
    fontSize: moderateScale(12, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  detailDesc: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.primary,
    lineHeight: moderateScale(22, 0.3),
    backgroundColor: theme.colors.background.elevated,
    borderRadius: 10,
    padding: moderateScale(12, 0.5),
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: verticalScale(4),
  },
  infoRowLabel: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.text.secondary,
  },
  infoRowValue: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },

  // Address
  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary.surface,
    borderRadius: 12,
    padding: moderateScale(12, 0.5),
    gap: 10,
    borderWidth: 1,
    borderColor: theme.colors.primary.DEFAULT + "20",
  },
  addressName: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  addressDetail: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.secondary,
    marginTop: 2,
  },

  mapContainer: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 4,
  },
  detailMap: {
    width: "100%",
    height: verticalScale(140),
    borderRadius: 12,
  },

  // Actions
  modalActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: verticalScale(4),
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    height: verticalScale(48),
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  actionBtnText: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
  },

  // Inline confirmation
  confirmBox: {
    backgroundColor: theme.colors.background.elevated,
    borderRadius: 16,
    padding: moderateScale(16, 0.5),
    gap: verticalScale(8),
    borderWidth: 1,
    borderColor: theme.colors.border.DEFAULT,
  },
  confirmTitle: {
    fontSize: moderateScale(15, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  confirmMessage: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.text.secondary,
    lineHeight: moderateScale(20, 0.3),
  },
  confirmButtons: {
    flexDirection: "row",
    gap: 8,
    marginTop: verticalScale(4),
  },
  confirmCancelBtn: {
    flex: 1,
    height: verticalScale(44),
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background.DEFAULT,
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
  },
  confirmCancelBtnText: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  confirmActionBtn: {
    flex: 1,
    height: verticalScale(44),
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmActionBtnText: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
  },
});
