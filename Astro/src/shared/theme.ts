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

export const pastelPalette = {
  softSlateBlue: '#6B8EB9',
  softCoralRose: '#DE6B81',
  softMutedTeal: '#47A9A3',
  softTaupeMocha: '#7D6855',
  softPlumOrchid: '#9C477B',
  mutedAmber: '#F59E0B',
  goldDivider: '#D4AF37',
  goldAccent: '#D4AF37',
  warmBackground: '#FAF9F6',
  cardSurface: '#FFFFFF',
  borderLight: '#E5E7EB',

  // Category mapping per PROJECT.md interface contract
  beforePregnancy: {
    badge: '#6B8EB9',
    title: '#3B5B88',
    bg: '#F4F7FB',
  },
  duringPregnancy: {
    badge: '#DE6B81',
    title: '#C24168',
    premium: '#F59E0B',
    bg: '#FDF6F8',
  },
  afterDelivery: {
    badge: '#47A9A3',
    title: '#28807A',
    bg: '#F2FAF9',
  },
  forEveryone: {
    badge: '#7D6855',
    title: '#5A4634',
    bg: '#F8F6F4',
  },
  forAllWomen: {
    badge: '#9C477B',
    title: '#7E2B5A',
    bg: '#F9F4F7',
  },
  neutrals: {
    background: '#FAF9F6',
    card: '#FFFFFF',
    border: '#E5E7EB',
  },
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
    pastelPalette,
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
