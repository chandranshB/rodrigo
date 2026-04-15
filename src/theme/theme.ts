export const theme = {
  colors: {
    primary: '#6C63FF', // Modern violet
    secondary: '#FF6584', // Playful pink
    accent: '#00D09C', // Emerald for Aura
    background: '#0F0F12', // Deep dark background
    surface: '#1A1A22', // Slightly lighter surface
    text: {
      primary: '#FFFFFF',
      secondary: '#A1A1AA',
      muted: '#71717A',
    },
    border: '#27272A',
    gradient: {
      aura: ['#00D09C', '#00A87E'],
      premium: ['#6C63FF', '#FF6584'],
      story: ['#FF6584', '#FF9A8B', '#FFD1FF'],
    },
  },
  typography: {
    fontFamily: {
      regular: 'System', // Using system fonts for reliability and elegance
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
    md: 12,
    lg: 20,
    full: 999,
  },
} as const;
