import { StyleSheet } from 'react-native';
import { theme } from '@/shared/constants';
import { moderateScale, scale, verticalScale } from '@/shared/utils/scale';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },
  header: {
    backgroundColor: theme.colors.primary.DEFAULT,
    paddingBottom: verticalScale(24),
    paddingHorizontal: moderateScale(24, 0.5),
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: moderateScale(12, 0.5),
  },
  headerTitle: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: moderateScale(24, 0.5),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(32),
    gap: moderateScale(4, 0.5),
  },
  subtitle: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
    marginBottom: verticalScale(8),
  },
  dayRow: {
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.neutral[100],
    paddingVertical: verticalScale(12),
  },
  dayRowLast: {
    borderBottomWidth: 0,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dayLabel: {
    flex: 1,
    fontSize: moderateScale(15, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  unavailableText: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.tertiary,
    marginRight: moderateScale(8, 0.5),
  },
  fullDayText: {
    fontSize: moderateScale(11, 0.3),
    color: theme.colors.text.tertiary,
    marginTop: verticalScale(4),
    fontStyle: 'italic',
  },
  copyButton: {
    padding: moderateScale(4, 0.5),
    marginRight: moderateScale(4, 0.5),
  },
  addButton: {
    padding: moderateScale(2, 0.5),
  },
  slotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(6, 0.5),
    marginTop: verticalScale(6),
    backgroundColor: theme.colors.background.elevated,
    borderRadius: theme.radii.sm,
    paddingHorizontal: moderateScale(10, 0.5),
    paddingVertical: verticalScale(7),
  },
  slotText: {
    flex: 1,
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  surchargeBadge: {
    backgroundColor: theme.colors.accent.yellow,
    borderRadius: 6,
    paddingHorizontal: moderateScale(6, 0.5),
    paddingVertical: verticalScale(2),
  },
  surchargeBadgeText: {
    fontSize: moderateScale(11, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[900],
  },
  addForm: {
    marginTop: verticalScale(8),
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.radii.md,
    padding: moderateScale(12, 0.5),
    gap: verticalScale(10),
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(8, 0.5),
  },
  timePickerBlock: {
    alignItems: 'center',
    gap: verticalScale(4),
    flex: 1,
  },
  timePickerLabel: {
    fontSize: moderateScale(11, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  timeArrow: {
    paddingTop: verticalScale(20),
  },
  surchargeRow: {
    gap: verticalScale(6),
  },
  surchargeLabel: {
    fontSize: moderateScale(11, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  surchargePresets: {
    flexDirection: 'row',
    gap: moderateScale(6, 0.5),
    flexWrap: 'wrap',
  },
  surchargePreset: {
    paddingHorizontal: moderateScale(12, 0.5),
    paddingVertical: verticalScale(6),
    borderRadius: theme.radii.full,
    borderWidth: 1,
    borderColor: theme.palette.neutral[200],
    backgroundColor: theme.colors.background.elevated,
  },
  surchargePresetActive: {
    backgroundColor: theme.colors.accent.yellow,
    borderColor: theme.colors.accent.yellow,
  },
  surchargePresetText: {
    fontSize: moderateScale(12, 0.3),
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  surchargePresetTextActive: {
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[900],
  },
  addFormActions: {
    flexDirection: 'row',
    gap: moderateScale(8, 0.5),
  },
  cancelButton: {
    flex: 1,
    height: verticalScale(40),
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.palette.neutral[200],
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.secondary,
  },
  confirmButton: {
    flex: 2,
    height: verticalScale(40),
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: theme.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonDisabled: {
    opacity: 0.6,
  },
  confirmButtonText: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
  },
  summaryCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.radii.lg,
    padding: moderateScale(16, 0.5),
    marginTop: verticalScale(8),
  },
  summaryText: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  toast: {
    position: 'absolute',
    left: moderateScale(24, 0.5),
    right: moderateScale(24, 0.5),
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8, 0.5),
    paddingHorizontal: moderateScale(16, 0.5),
    paddingVertical: verticalScale(12),
    borderRadius: theme.radii.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: scale(4) },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 6,
  },
  toastSuccess: {
    backgroundColor: theme.colors.accent.green,
  },
  toastError: {
    backgroundColor: theme.palette.error[500],
  },
  toastText: {
    flex: 1,
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.palette.neutral[0],
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    paddingHorizontal: moderateScale(32, 0.5),
  },
  modalCard: {
    backgroundColor: theme.colors.background.DEFAULT,
    borderRadius: theme.radii.xl,
    padding: moderateScale(24, 0.5),
    gap: verticalScale(4),
  },
  modalTitle: {
    fontSize: moderateScale(18, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(2),
  },
  modalSubtitle: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.text.secondary,
    marginBottom: verticalScale(12),
  },
  modalDayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(12, 0.5),
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.neutral[100],
  },
  checkbox: {
    width: scale(22),
    height: scale(22),
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.palette.neutral[300],
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: theme.colors.primary.DEFAULT,
    borderColor: theme.colors.primary.DEFAULT,
  },
  modalDayLabel: {
    fontSize: moderateScale(15, 0.3),
    color: theme.colors.text.primary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  modalActions: {
    flexDirection: 'row',
    gap: moderateScale(8, 0.5),
    marginTop: verticalScale(16),
  },
});

export default styles;
