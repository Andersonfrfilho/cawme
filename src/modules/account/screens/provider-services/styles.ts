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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: moderateScale(24, 0.5),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(32),
    gap: moderateScale(20, 0.5),
  },
  subtitle: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
  },
  categoryPillsRow: {
    flexDirection: 'row',
  },
  categoryPill: {
    paddingHorizontal: moderateScale(16, 0.5),
    paddingVertical: moderateScale(10, 0.5),
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.background.card,
    borderWidth: 1,
    borderColor: theme.palette.neutral[200],
    marginRight: moderateScale(10, 0.5),
  },
  categoryPillActive: {
    backgroundColor: theme.colors.primary.DEFAULT,
    borderColor: theme.colors.primary.DEFAULT,
  },
  categoryPillText: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },
  categoryPillTextActive: {
    color: theme.palette.neutral[0],
  },
  addServiceButton: {
    flexDirection: 'row',
    height: verticalScale(48),
    borderWidth: 2,
    borderColor: theme.colors.primary.DEFAULT,
    borderStyle: 'dashed',
    borderRadius: theme.radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(8, 0.5),
  },
  addServiceButtonText: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.primary.DEFAULT,
  },
  serviceCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.radii.lg,
    padding: moderateScale(16, 0.5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceInfo: {
    flex: 1,
    marginRight: moderateScale(12, 0.5),
  },
  serviceName: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(4),
  },
  serviceDetails: {
    fontSize: moderateScale(12, 0.3),
    color: theme.colors.text.secondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: verticalScale(48),
    gap: verticalScale(8),
  },
  emptyStateText: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: theme.colors.background.DEFAULT,
    borderTopLeftRadius: theme.radii.xl,
    borderTopRightRadius: theme.radii.xl,
    padding: moderateScale(24, 0.5),
    paddingBottom: verticalScale(40),
  },
  modalHandle: {
    width: scale(40),
    height: verticalScale(4),
    borderRadius: 2,
    backgroundColor: theme.palette.neutral[200],
    alignSelf: 'center',
    marginBottom: verticalScale(20),
  },
  modalTitle: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(20),
  },
  fieldLabel: {
    fontSize: moderateScale(13, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    marginBottom: verticalScale(6),
  },
  fieldInput: {
    height: verticalScale(48),
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
    borderRadius: theme.radii.md,
    paddingHorizontal: moderateScale(14, 0.5),
    fontSize: moderateScale(15, 0.3),
    color: theme.colors.text.primary,
    backgroundColor: theme.colors.background.elevated,
    marginBottom: verticalScale(16),
  },
  fieldInputFocused: {
    borderColor: theme.colors.primary.DEFAULT,
  },
  submitButton: {
    height: verticalScale(52),
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: theme.radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(8),
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
  },
  sectionLabel: {
    fontSize: moderateScale(13, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    marginBottom: verticalScale(10),
  },
  pickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(8, 0.5),
    marginBottom: verticalScale(16),
  },
  pickerItem: {
    paddingHorizontal: moderateScale(14, 0.5),
    paddingVertical: verticalScale(8),
    borderRadius: theme.radii.lg,
    borderWidth: 1.5,
    borderColor: theme.colors.border.DEFAULT,
    backgroundColor: theme.colors.background.elevated,
  },
  pickerItemActive: {
    borderColor: theme.colors.primary.DEFAULT,
    backgroundColor: theme.colors.primary.DEFAULT,
  },
  pickerItemNew: {
    borderStyle: 'dashed',
    borderColor: theme.colors.primary.DEFAULT,
    backgroundColor: 'transparent',
  },
  pickerItemText: {
    fontSize: moderateScale(13, 0.3),
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  pickerItemTextActive: {
    color: theme.palette.neutral[0],
  },
  pickerItemTextNew: {
    color: theme.colors.primary.DEFAULT,
  },
});

export default styles;
