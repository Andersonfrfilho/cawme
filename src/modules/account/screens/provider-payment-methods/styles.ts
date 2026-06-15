import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants";
import { moderateScale, scale, verticalScale } from "@/shared/utils/scale";

const styles = StyleSheet.create({
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
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: moderateScale(24, 0.5),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(32),
    gap: moderateScale(12, 0.5),
  },
  subtitle: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
    marginBottom: moderateScale(8, 0.5),
  },
  methodCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.radii.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
    overflow: "hidden",
  },
  methodCardSelected: {
    borderColor: theme.colors.primary.DEFAULT,
  },
  methodRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(16, 0.5),
    paddingVertical: moderateScale(14, 0.5),
    gap: moderateScale(12, 0.5),
  },
  methodIconWrapper: {
    width: scale(36),
    height: scale(36),
    borderRadius: 18,
    backgroundColor: theme.colors.primary.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  methodIconWrapperSelected: {
    backgroundColor: theme.colors.primary.DEFAULT,
  },
  methodInfo: {
    flex: 1,
  },
  methodLabel: {
    fontSize: moderateScale(15, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  methodLabelSelected: {
    color: theme.colors.primary.DEFAULT,
  },
  checkCircle: {
    width: scale(22),
    height: scale(22),
    borderRadius: 11,
    borderWidth: 2,
    borderColor: theme.colors.border.DEFAULT,
    alignItems: "center",
    justifyContent: "center",
  },
  checkCircleSelected: {
    borderColor: theme.colors.primary.DEFAULT,
    backgroundColor: theme.colors.primary.DEFAULT,
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.DEFAULT,
    paddingHorizontal: moderateScale(16, 0.5),
    paddingVertical: moderateScale(12, 0.5),
    gap: moderateScale(10, 0.5),
  },
  detailLabel: {
    fontSize: moderateScale(12, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    marginBottom: verticalScale(4),
  },
  detailInput: {
    height: verticalScale(44),
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
    borderRadius: theme.radii.md,
    paddingHorizontal: moderateScale(12, 0.5),
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.elevated,
  },
  detailInputFocused: {
    borderColor: theme.colors.primary.DEFAULT,
  },
  detailInputError: {
    borderColor: theme.colors.status.error,
  },
  pixKeyErrorText: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.status.error,
    marginTop: verticalScale(-4),
  },
  pixKeyTypeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: moderateScale(8, 0.5),
  },
  pixKeyTypePill: {
    paddingHorizontal: moderateScale(12, 0.5),
    paddingVertical: moderateScale(6, 0.5),
    borderRadius: theme.radii.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
    backgroundColor: theme.colors.background.elevated,
  },
  pixKeyTypePillActive: {
    borderColor: theme.colors.primary.DEFAULT,
    backgroundColor: theme.colors.primary.DEFAULT,
  },
  pixKeyTypePillText: {
    fontSize: moderateScale(13, 0.3),
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  pixKeyTypePillTextActive: {
    color: theme.palette.neutral[0],
  },
  saveButton: {
    height: verticalScale(52),
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: theme.radii.lg,
    alignItems: "center",
    justifyContent: "center",
    marginTop: moderateScale(8, 0.5),
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
  },
  // Card preview
  cardPreview: {
    width: "100%",
    height: verticalScale(160),
    backgroundColor: theme.colors.text.primary,
    borderRadius: 12,
    padding: moderateScale(20, 0.5),
    justifyContent: "space-between",
    marginBottom: moderateScale(12, 0.5),
  },
  cardChip: {
    width: scale(40),
    height: scale(28),
    backgroundColor: theme.colors.accent.yellow,
    borderRadius: 6,
  },
  cardAcceptsLabel: {
    fontSize: moderateScale(10, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.palette.neutral[0],
    opacity: 0.7,
    marginBottom: moderateScale(6, 0.5),
    letterSpacing: 1,
  },
  cardEmptyLabel: {
    fontSize: moderateScale(13, 0.3),
    color: theme.palette.neutral[0],
    opacity: 0.4,
  },
  cardBrandRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: moderateScale(6, 0.5),
  },
  cardBrandBadge: {
    paddingHorizontal: moderateScale(10, 0.5),
    paddingVertical: moderateScale(5, 0.5),
    borderRadius: 6,
  },
  cardBrandText: {
    fontSize: moderateScale(11, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
    letterSpacing: 0.5,
  },
  // Bank autocomplete
  bankDropdown: {
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.background.elevated,
    overflow: "hidden",
    marginTop: verticalScale(4),
  },
  bankDropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: moderateScale(12, 0.5),
    paddingVertical: moderateScale(10, 0.5),
    gap: moderateScale(10, 0.5),
  },
  bankDropdownItemSeparator: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border.DEFAULT,
  },
  bankDropdownName: {
    flex: 1,
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  // Card brand pills (selection)
  brandPill: {
    borderWidth: 2,
    borderColor: "transparent",
    borderRadius: 10,
    padding: moderateScale(3, 0.5),
    overflow: "hidden",
  },
});

export default styles;
