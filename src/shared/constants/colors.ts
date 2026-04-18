// Extraídas do logo: azul royal, verde checkmark, amarelo exclamação
export const palette = {
  blue: {
    50:  '#EEF2FF',
    100: '#C7D4FD',
    200: '#9FB6FB',
    300: '#7798F9',
    400: '#4F7AF7',
    500: '#1A45E8', // primary — fundo do logo
    600: '#1438CC',
    700: '#0E2BAF',
    800: '#091F93',
    900: '#041376',
    950: '#020B52',
  },
  green: {
    50:  '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E', // accent — checkmark do logo
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
  },
  yellow: {
    50:  '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F5A623', // accent — exclamação do logo
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F',
  },
  neutral: {
    0:   '#FFFFFF',
    50:  '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },
  error: {
    50:  '#FEF2F2',
    300: '#FCA5A5',
    500: '#EF4444',
    700: '#B91C1C',
  },
} as const;

export const colors = {
  primary: {
    DEFAULT:  palette.blue[500],
    light:    palette.blue[400],
    lighter:  palette.blue[200],
    dark:     palette.blue[700],
    darker:   palette.blue[900],
    surface:  palette.blue[50],
  },
  accent: {
    green:        palette.green[500],
    greenLight:   palette.green[100],
    greenDark:    palette.green[700],
    yellow:       palette.yellow[500],
    yellowLight:  palette.yellow[100],
    yellowDark:   palette.yellow[700],
  },
  background: {
    DEFAULT:  palette.neutral[50],
    card:     palette.neutral[0],
    elevated: palette.neutral[100],
    inverse:  palette.blue[500],
  },
  text: {
    primary:   palette.neutral[900],
    secondary: palette.neutral[600],
    tertiary:  palette.neutral[400],
    disabled:  palette.neutral[300],
    inverse:   palette.neutral[0],
    link:      palette.blue[500],
  },
  border: {
    DEFAULT: palette.neutral[200],
    focus:   palette.blue[500],
    error:   palette.error[500],
  },
  status: {
    success: palette.green[500],
    warning: palette.yellow[500],
    error:   palette.error[500],
    info:    palette.blue[500],
  },
} as const;

export type Colors = typeof colors;
