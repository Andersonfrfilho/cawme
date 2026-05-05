import { StyleSheet } from 'react-native';
import { theme } from "@/shared/constants";
import { moderateScale, verticalScale } from '@/shared/utils/scale';

export const styles = StyleSheet.create({
  // Estilo base compartilhado por todos os componentes SDUI placeholder
  card: {
    padding: theme.spacing[4],
    margin: theme.spacing[2],
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.radii.lg,
  },
  cardTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
  },
  // SduiRenderer
  scrollView: {
    flex: 1,
    backgroundColor: theme.colors.background.DEFAULT,
  },
  // Section
  sectionContainer: {
    marginBottom: verticalScale(24),
    paddingHorizontal: theme.spacing[4],
    paddingTop: verticalScale(16),
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(16),
  },
  // CategoryList
  categoryListContent: {
    paddingHorizontal: theme.spacing[2],
    paddingVertical: verticalScale(8),
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[4],
    paddingVertical: verticalScale(10),
    marginRight: theme.spacing[2],
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.radii.full,
  },
  categoryIcon: {
    marginRight: moderateScale(8, 0.5),
  },
  categoryImage: {
    width: moderateScale(20, 0.3),
    height: moderateScale(20, 0.3),
    marginRight: moderateScale(8, 0.5),
    borderRadius: 4,
  },
  categoryChipText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
  },
  // ProviderGrid
  providerGridContent: {
    paddingBottom: verticalScale(8),
  },
  providerGridRow: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing[3],
  },
  providerCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.radii.lg,
    overflow: 'hidden',
    marginRight: theme.spacing[3],
  },
  providerImage: {
    width: '100%',
    height: moderateScale(120, 0.5),
    backgroundColor: theme.palette.neutral[100],
  },
  providerImagePlaceholder: {
    width: '100%',
    height: moderateScale(120, 0.5),
    backgroundColor: theme.palette.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  providerContent: {
    padding: theme.spacing[3],
  },
  providerName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.primary,
    marginBottom: verticalScale(4),
  },
  providerService: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(6),
    gap: moderateScale(4, 0.3),
  },
  providerServiceText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  providerRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(6),
  },
  providerRatingText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginLeft: moderateScale(4, 0.3),
  },
  providerMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: moderateScale(8, 0.3),
  },
  providerMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: moderateScale(4, 0.3),
  },
  providerMetaText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.tertiary,
  },
  providerLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerLocationText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginLeft: moderateScale(4, 0.3),
    flex: 1,
  },
});
