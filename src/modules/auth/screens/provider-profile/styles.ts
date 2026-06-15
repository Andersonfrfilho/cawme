import { Dimensions, StyleSheet } from 'react-native';
import { theme } from '@/shared/constants';
import { scale, verticalScale, moderateScale } from '@/shared/utils/scale';

const SCREEN_WIDTH = Dimensions.get('window').width;
const HORIZONTAL_PADDING = moderateScale(24, 0.5);
const CARD_GAP = moderateScale(16, 0.5);
const CATEGORY_CARD_WIDTH = (SCREEN_WIDTH - HORIZONTAL_PADDING * 2 - CARD_GAP) / 2;

export default StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: moderateScale(24, 0.5),
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(24),
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
    width: CATEGORY_CARD_WIDTH,
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

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.palette.neutral[200],
    paddingHorizontal: moderateScale(12, 0.5),
    height: verticalScale(48),
    marginBottom: verticalScale(8),
  },

  searchInput: {
    flex: 1,
    fontSize: moderateScale(14, 0.3),
    color: theme.colors.text.primary,
    paddingVertical: 0,
  },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(8, 0.5),
  },

  addCategoryIconButton: {
    width: verticalScale(48),
    height: verticalScale(48),
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.primary.DEFAULT,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  addCategoryModal: {
    backgroundColor: theme.colors.background.DEFAULT,
    borderTopLeftRadius: theme.radii.xl,
    borderTopRightRadius: theme.radii.xl,
    padding: moderateScale(24, 0.5),
    paddingBottom: verticalScale(40),
  },

  addCategoryModalHandle: {
    width: scale(40),
    height: verticalScale(4),
    borderRadius: 2,
    backgroundColor: theme.palette.neutral[200],
    alignSelf: 'center',
    marginBottom: verticalScale(20),
  },

  addCategoryModalTitle: {
    fontSize: moderateScale(20, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(8),
  },

  actionBar: {
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
