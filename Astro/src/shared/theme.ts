export const palette = {
  primary: '#FF7B89', // Soft warm coral often associated with maternity
  primaryLight: '#FFA7B1',
  secondary: '#6BAE98', // Calming sage green
  backgroundLight: '#FDFCFB',
  surfaceLight: '#FFFFFF',
  textDark: '#2D3748',
  textMuted: '#718096',
  error: '#E53E3E',
  success: '#38A169',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const typography = {
  fontFamily: {
    // We could extend this to load specific Hindi fonts if required
    regular: 'System',
    bold: 'System',
  },
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
  },
};

export const theme = {
  colors: {
    ...palette,
    primary: palette.primary,
    background: palette.backgroundLight,
    surface: palette.surfaceLight,
    text: palette.textDark,
    textSecondary: palette.textMuted,
    border: '#E2E8F0',
  },
  spacing,
  typography,
  // Add dark mode support here later if needed
};

export type Theme = typeof theme;
