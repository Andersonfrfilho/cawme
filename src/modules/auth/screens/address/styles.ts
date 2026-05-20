import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from "@/shared/utils/scale";

export const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: moderateScale(24, 0.5),
    paddingTop: verticalScale(32),
    paddingBottom: verticalScale(24),
  },

  // ── Step: CEP ────────────────────────────────────────────────────────────────
  cepStepHeader: {
    marginBottom: verticalScale(32),
  },
  cepStepTitle: {
    fontSize: moderateScale(26, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(8),
  },
  cepStepSubtitle: {
    fontSize: moderateScale(15, 0.3),
    color: theme.colors.text.secondary,
    lineHeight: moderateScale(22, 0.3),
  },
  cepInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.palette.neutral[0],
    borderWidth: 2,
    borderColor: theme.colors.primary.DEFAULT,
    borderRadius: theme.radii.lg,
    paddingHorizontal: moderateScale(16, 0.5),
    paddingVertical: verticalScale(14),
    marginBottom: verticalScale(8),
  },
  cepInputRowError: {
    borderColor: theme.colors.status.error,
  },
  cepIcon: {
    marginRight: moderateScale(12, 0.5),
  },
  cepInput: {
    flex: 1,
    fontSize: moderateScale(20, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    letterSpacing: 2,
    paddingVertical: 0,
  },
  cepErrorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6, 0.5),
    marginBottom: verticalScale(16),
  },
  cepErrorText: {
    flex: 1,
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.status.error,
    lineHeight: moderateScale(18, 0.3),
  },
  dontKnowCepButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: moderateScale(4, 0.5),
    paddingVertical: verticalScale(8),
    marginTop: verticalScale(8),
  },
  dontKnowCepText: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.primary.DEFAULT,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  orDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(12, 0.5),
    marginTop: verticalScale(20),
    marginBottom: verticalScale(16),
  },
  orDividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: theme.palette.neutral[200],
  },
  orDividerText: {
    fontSize: moderateScale(12, 0.3),
    color: theme.palette.neutral[400],
    fontWeight: theme.typography.fontWeight.medium,
  },

  // ── Step: Autocomplete ───────────────────────────────────────────────────────
  searchHeader: {
    paddingHorizontal: moderateScale(16, 0.5),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(8),
    backgroundColor: theme.palette.neutral[0],
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.neutral[100],
  },
  searchBackButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  searchBackText: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.primary.DEFAULT,
    fontWeight: theme.typography.fontWeight.semibold,
    marginLeft: moderateScale(4, 0.5),
  },
  searchInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background.DEFAULT,
    borderRadius: theme.radii.lg,
    paddingHorizontal: moderateScale(14, 0.5),
    paddingVertical: verticalScale(12),
    gap: moderateScale(10, 0.5),
  },
  searchIcon: {
    flexShrink: 0,
  },
  searchInput: {
    flex: 1,
    fontSize: moderateScale(15, 0.3),
    color: theme.colors.text.primary,
    paddingVertical: 0,
  },
  suggestionScrollView: {
    flex: 1,
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(16, 0.5),
    paddingVertical: verticalScale(14),
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.neutral[100],
    gap: moderateScale(12, 0.5),
  },
  suggestionItemLast: {
    borderBottomWidth: 0,
  },
  suggestionIcon: {
    width: moderateScale(36, 0.3),
    height: moderateScale(36, 0.3),
    borderRadius: 18,
    backgroundColor: theme.colors.primary.DEFAULT + "12",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionStreet: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(2),
  },
  suggestionCity: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.secondary,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: verticalScale(60),
    gap: verticalScale(8),
  },
  emptyStateText: {
    fontSize: moderateScale(15, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  emptyStateSubtext: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.text.secondary,
  },

  // ── Step: Confirm ────────────────────────────────────────────────────────────
  confirmMapContainer: {
    height: verticalScale(220),
    overflow: "hidden",
  },
  confirmMap: {
    flex: 1,
  },
  confirmMapTouchable: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: moderateScale(12, 0.5),
  },
  confirmMapAdjustBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6, 0.5),
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: theme.radii.full,
    paddingVertical: verticalScale(8),
    paddingHorizontal: moderateScale(14, 0.5),
  },
  confirmMapAdjustText: {
    fontSize: moderateScale(12, 0.3),
    color: theme.palette.neutral[0],
    fontWeight: theme.typography.fontWeight.semibold,
  },
  confirmSection: {
    marginBottom: verticalScale(28),
  },
  foundBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: moderateScale(6, 0.5),
    marginBottom: verticalScale(12),
  },
  foundBadgeText: {
    fontSize: moderateScale(13, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.status.success,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.palette.neutral[0],
    borderRadius: theme.radii.lg,
    padding: moderateScale(16, 0.5),
    gap: moderateScale(12, 0.5),
    borderWidth: 1,
    borderColor: theme.palette.neutral[100],
  },
  addressCardIcon: {
    width: moderateScale(40, 0.3),
    height: moderateScale(40, 0.3),
    borderRadius: 20,
    backgroundColor: theme.colors.primary.DEFAULT + "12",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  addressCardContent: {
    flex: 1,
  },
  addressCardStreet: {
    fontSize: moderateScale(15, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(2),
  },
  addressCardCity: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.text.secondary,
  },
  addressCardCep: {
    fontSize: moderateScale(12, 0.3),
    color: theme.palette.neutral[400],
    marginTop: verticalScale(2),
  },
  changeButton: {
    paddingHorizontal: moderateScale(10, 0.5),
    paddingVertical: verticalScale(6),
    flexShrink: 0,
  },
  changeButtonText: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.primary.DEFAULT,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  mapButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: moderateScale(8, 0.5),
    borderWidth: 1.5,
    borderColor: theme.colors.primary.DEFAULT,
    borderRadius: theme.radii.lg,
    paddingVertical: verticalScale(14),
    marginBottom: verticalScale(28),
    backgroundColor: theme.colors.primary.DEFAULT + "08",
  },
  mapButtonText: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.primary.DEFAULT,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  fieldsSection: {
    gap: verticalScale(16),
  },
  numberRow: {
    flexDirection: "row",
    gap: moderateScale(12, 0.5),
  },
  numberField: {
    flex: 1,
  },
  complementField: {
    flex: 1.8,
  },
  fieldLabel: {
    fontSize: moderateScale(12, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.palette.neutral[500],
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: verticalScale(6),
  },
  fieldInput: {
    backgroundColor: theme.palette.neutral[0],
    borderWidth: 1.5,
    borderColor: theme.palette.neutral[200],
    borderRadius: theme.radii.lg,
    paddingHorizontal: moderateScale(14, 0.5),
    paddingVertical: verticalScale(12),
    fontSize: moderateScale(15, 0.3),
    color: theme.colors.text.primary,
  },
  fieldInputError: {
    borderColor: theme.colors.status.error,
  },
  fieldError: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.status.error,
    marginTop: verticalScale(4),
  },

  // ── Footer (compartilhado) ───────────────────────────────────────────────────
  footer: {
    paddingHorizontal: moderateScale(24, 0.5),
    paddingTop: verticalScale(12),
    backgroundColor: theme.palette.neutral[0],
    borderTopWidth: 1,
    borderTopColor: theme.palette.neutral[100],
  },
  advanceButton: {
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: theme.radii.lg,
    paddingVertical: verticalScale(16),
    alignItems: "center",
  },
  advanceButtonDisabled: {
    opacity: 0.5,
  },
  advanceButtonText: {
    color: theme.palette.neutral[0],
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
  },
});
