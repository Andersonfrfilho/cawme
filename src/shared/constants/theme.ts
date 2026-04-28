import { Platform } from 'react-native';
import { colors, palette } from './colors';

// Espaçamento — base 4px (grid de 4)
export const spacing = {
  0:    0,
  0.5:  2,
  1:    4,
  1.5:  6,
  2:    8,
  2.5:  10,
  3:    12,
  3.5:  14,
  4:    16,
  5:    20,
  6:    24,
  7:    28,
  8:    32,
  9:    36,
  10:   40,
  11:   44,
  12:   48,
  14:   56,
  16:   64,
  20:   80,
  24:   96,
  28:   112,
  32:   128,
} as const;

// Border radius
export const radii = {
  none:   0,
  xs:     4,
  sm:     8,
  md:     12,
  lg:     16,
  xl:     20,
  '2xl':  24,
  '3xl':  32,
  full:   9999,
} as const;

// Tipografia
export const typography = {
  fontFamily: {
    sans:  Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }),
    mono:  Platform.select({ ios: 'Courier New', android: 'monospace', default: 'monospace' }),
  },
  fontSize: {
    xs:   10,
    sm:   12,
    base: 14,
    md:   16,
    lg:   18,
    xl:   20,
    '2xl': 24,
    '3xl': 28,
    '4xl': 32,
    '5xl': 40,
  },
  fontWeight: {
    regular:  '400',
    medium:   '500',
    semibold: '600',
    bold:     '700',
    extrabold:'800',
  },
  lineHeight: {
    tight:  1.2,
    snug:   1.375,
    normal: 1.5,
    relaxed: 1.625,
  },
  letterSpacing: {
    tight:  -0.5,
    normal: 0,
    wide:   0.5,
    wider:  1,
    widest: 2,
  },
} as const;

// Sombras
export const shadows = {
  none: {
    shadowColor:   'transparent',
    shadowOffset:  { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius:  0,
    elevation:     0,
  },
  sm: {
    shadowColor:   colors.primary.darker,
    shadowOffset:  { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius:  3,
    elevation:     2,
  },
  md: {
    shadowColor:   colors.primary.darker,
    shadowOffset:  { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius:  6,
    elevation:     4,
  },
  lg: {
    shadowColor:   colors.primary.darker,
    shadowOffset:  { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius:  12,
    elevation:     8,
  },
  xl: {
    shadowColor:   colors.primary.darker,
    shadowOffset:  { width: 0, height: 8 },
    shadowOpacity: 0.20,
    shadowRadius:  20,
    elevation:     12,
  },
} as const;

// Métricas de layout recomendadas
export const metrics = {
  // Estrutura de tela
  screenPaddingHorizontal: spacing[4],  // 16px
  screenPaddingVertical:   spacing[3],  // 12px
  sectionGap:              spacing[6],  // 24px
  itemGap:                 spacing[3],  // 12px

  // Componentes
  buttonHeight: {
    sm: 36,
    md: 48,
    lg: 56,
  },
  inputHeight: 48,
  avatarSize: {
    xs: 24,
    sm: 32,
    md: 40,
    lg: 56,
    xl: 72,
  },
  iconSize: {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32,
  },
  cardRadius:  radii.lg,   // 16px
  buttonRadius: radii.xl,  // 20px — arredondado como o logo
  inputRadius:  radii.md,  // 12px
  chipRadius:   radii.full,

  // Bottom sheet
  bottomSheetHandleHeight: 4,
  bottomSheetSnapPoints:   ['40%', '75%', '95%'],

  // Navegação
  tabBarHeight:   Platform.select({ ios: 83, android: 60, default: 60 })!,
  headerHeight:   Platform.select({ ios: 96, android: 64, default: 64 })!,
  statusBarHeight: Platform.select({ ios: 44, android: 0, default: 0 })!,
} as const;

// Duração de animações
export const animation = {
  fast:   150,
  normal: 250,
  slow:   400,
} as const;

// Breakpoints (para layouts responsivos em tablet)
export const breakpoints = {
  sm:  380,
  md:  768,
  lg:  1024,
} as const;

export const theme = {
  colors,
  palette,
  spacing,
  radii,
  typography,
  shadows,
  metrics,
  animation,
  breakpoints,
} as const;

export type Theme = typeof theme;
