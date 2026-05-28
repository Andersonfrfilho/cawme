import { StyleSheet } from 'react-native';
import { theme } from '@/shared/constants';
import { scale, verticalScale, moderateScale } from '@/shared/utils/scale';

export default StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: moderateScale(24, 0.5),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(120),
  },

  headerSection: {
    marginBottom: verticalScale(32),
  },

  title: {
    fontSize: moderateScale(24, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(8),
  },

  subtitle: {
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.secondary,
    lineHeight: moderateScale(20, 0.3),
  },

  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(16, 0.5),
  },

  categoryCard: {
    width: '48%',
    aspectRatio: 1,
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.radii.lg,
    padding: moderateScale(16, 0.5),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.palette.neutral[200],
  },

  categoryCardSelected: {
    backgroundColor: theme.colors.primary.surface,
    borderColor: theme.colors.primary.DEFAULT,
  },

  categoryIcon: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    backgroundColor: theme.colors.primary.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: verticalScale(12),
  },

  categoryIconSelected: {
    backgroundColor: theme.colors.primary.DEFAULT,
  },

  categoryName: {
    fontSize: moderateScale(13, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    textAlign: 'center',
  },

  categoryNameSelected: {
    color: theme.colors.primary.DEFAULT,
  },

  checkmark: {
    position: 'absolute',
    top: moderateScale(8, 0.5),
    right: moderateScale(8, 0.5),
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.background.DEFAULT,
    borderTopWidth: 1,
    borderTopColor: theme.palette.neutral[100],
    padding: moderateScale(20, 0.5),
  },

  nextButton: {
    flexDirection: 'row',
    height: verticalScale(56),
    backgroundColor: theme.colors.primary.DEFAULT,
    borderRadius: theme.radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(8, 0.5),
  },

  nextButtonDisabled: {
    opacity: 0.5,
  },

  nextButtonText: {
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.palette.neutral[0],
  },

  servicesContainer: {
    marginBottom: verticalScale(24),
  },

  categorySection: {
    marginBottom: verticalScale(24),
  },

  categorySectionTitle: {
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(12),
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
    marginBottom: verticalScale(12),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  serviceInfo: {
    flex: 1,
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

  serviceActions: {
    flexDirection: 'row',
    gap: moderateScale(8, 0.5),
  },

  timePickerContainer: {
    marginBottom: verticalScale(24),
  },

  timePickerLabel: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(8),
  },

  timeInputRow: {
    flexDirection: 'row',
    gap: moderateScale(12, 0.5),
    marginBottom: verticalScale(12),
  },

  timeInput: {
    flex: 1,
    height: verticalScale(48),
    borderWidth: 1,
    borderColor: theme.palette.neutral[200],
    borderRadius: theme.radii.md,
    paddingHorizontal: moderateScale(12, 0.5),
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.primary,
  },

  reviewSection: {
    marginBottom: verticalScale(24),
  },

  reviewTitle: {
    fontSize: moderateScale(16, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(12),
  },

  reviewItem: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.radii.lg,
    padding: moderateScale(16, 0.5),
    marginBottom: verticalScale(12),
  },

  reviewItemTitle: {
    fontSize: moderateScale(14, 0.3),
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
  },

  reviewItemContent: {
    fontSize: moderateScale(13, 0.3),
    color: theme.colors.text.secondary,
    marginTop: verticalScale(8),
  },

  categoryPill: {
    paddingHorizontal: moderateScale(16, 0.5),
    paddingVertical: moderateScale(10, 0.5),
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.background.card,
    borderWidth: 1,
    borderColor: theme.palette.neutral[200],
    marginRight: moderateScale(12, 0.5),
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

  dayAvailabilityItem: {
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.neutral[100],
    paddingBottom: verticalScale(16),
    marginBottom: verticalScale(16),
  },
});
