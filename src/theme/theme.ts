export const theme = {
  colors: {
    primary: '#B392F0', // Soft Lavender
    secondary: '#F2C94C', // Vibrant Gold
    accent: '#00F0FF', // Cyber Cyan
    background: '#0D0E15', // Midnight Void
    surface: '#161824', // Deep Surface
    surfaceLight: '#222536',
    text: {
      primary: '#FFFFFF',
      secondary: '#9BA1B0',
      muted: '#636878',
    },
    border: '#2A2D3E',
    gradient: {
      aura: ['#00F0FF', '#0075FF'],
      premium: ['#B392F0', '#FF8A00'],
      story: ['#F2C94C', '#FF3A44'],
    },
  },
  typography: {
    fontFamily: {
      regular: 'System',
      bold: 'System',
    },
    size: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
      xxl: 32,
    },
    weight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    full: 999,
  },
} as const;
