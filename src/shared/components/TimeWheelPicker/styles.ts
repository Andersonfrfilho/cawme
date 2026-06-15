import { StyleSheet } from 'react-native';
import { theme } from '@/shared/constants';
import { moderateScale, scale, verticalScale } from '@/shared/utils/scale';

export const ITEM_HEIGHT = verticalScale(48);
export const VISIBLE_ITEMS = 3;

export const styles = StyleSheet.create({
  picker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: moderateScale(4, 0.5),
  },
  drumWrapper: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    width: scale(60),
    overflow: 'hidden',
  },
  selectionBar: {
    position: 'absolute',
    top: ITEM_HEIGHT,
    height: ITEM_HEIGHT,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.primary.surface,
    borderRadius: theme.radii.md,
    borderWidth: 1.5,
    borderColor: theme.colors.primary.lighter,
  },
  drum: {
    flex: 1,
  },
  drumContent: {
    paddingVertical: ITEM_HEIGHT,
  },
  drumItem: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
  },
  drumItemText: {
    fontSize: moderateScale(16, 0.3),
    color: theme.colors.text.tertiary,
    fontWeight: theme.typography.fontWeight.regular,
  },
  drumItemTextActive: {
    fontSize: moderateScale(22, 0.3),
    color: theme.colors.primary.DEFAULT,
    fontWeight: theme.typography.fontWeight.bold,
  },
  drumItemTextDisabled: {
    opacity: 0.25,
  },
  separator: {
    fontSize: moderateScale(22, 0.3),
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginTop: verticalScale(2),
  },
  label: {
    fontSize: moderateScale(10, 0.3),
    color: theme.colors.text.tertiary,
    marginTop: verticalScale(2),
    textAlign: 'center',
  },
});
