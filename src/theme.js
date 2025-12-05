// src/theme.js
const fontConfig = { fontFamily: 'System' };

export const LightTheme = {
  colors: {
    // Primary colors - Fresh teal/blue
    primary: '#4F46E5',
    primaryDark: '#4338CA',
    primaryLight: '#818CF8',
    
    // Accent colors - Vibrant green
    accent: '#10B981',
    accentDark: '#059669',
    
    // Backgrounds - Light and airy
    background: '#F9FAFB',
    backgroundAlt: '#F3F4F6',
    
    // Surfaces - Clean whites
    surface: '#FFFFFF',
    surfaceAlt: '#F9FAFB',
    surfaceHover: '#F3F4F6',
    
    // Text colors
    text: '#1F2937',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    
    // Status colors
    error: '#EF4444',
    errorLight: '#FEE2E2',
    success: '#10B981',
    successLight: '#D1FAE5',
    warning: '#F59E0B',
    warningLight: '#FEF3C7',
    
    // Borders and dividers
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    divider: '#F0F0F0',
    
    // Shadows and overlays
    shadow: 'rgba(0, 0, 0, 0.05)',
    overlay: 'rgba(0, 0, 0, 0.2)',
    
    // Gradients
    gradient1: ['#4F46E5', '#818CF8'],
    gradient2: ['#4F46E5', '#10B981'],
    gradient3: ['#10B981', '#06B6D4'],
  },
  
  roundness: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 999,
  },
  
  fonts: fontConfig,
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },
  
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 26,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    },
    bodySm: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 16,
    },
  },
  
  shadows: {
    none: null,
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 6,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 5,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.12,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};

export const DarkTheme = {
  colors: {
    // Primary colors - Lighter for dark backgrounds
    primary: '#818CF8',
    primaryDark: '#6366F1',
    primaryLight: '#A5B4FC',
    
    // Accent colors - Vibrant green
    accent: '#34D399',
    accentDark: '#10B981',
    
    // Backgrounds - Dark tones
    background: '#0F172A',
    backgroundAlt: '#1E293B',
    
    // Surfaces - Dark grays
    surface: '#1E293B',
    surfaceAlt: '#334155',
    surfaceHover: '#475569',
    
    // Text colors - Light for dark backgrounds
    text: '#F1F5F9',
    textSecondary: '#CBD5E1',
    textTertiary: '#94A3B8',
    
    // Status colors
    error: '#FF6B6B',
    errorLight: '#FFE0E0',
    success: '#34D399',
    successLight: '#A7F3D0',
    warning: '#FFA500',
    warningLight: '#FED7AA',
    
    // Borders and dividers
    border: '#334155',
    borderLight: '#475569',
    divider: '#2D3748',
    
    // Shadows and overlays
    shadow: 'rgba(0, 0, 0, 0.3)',
    overlay: 'rgba(0, 0, 0, 0.5)',
    
    // Gradients
    gradient1: ['#6366F1', '#818CF8'],
    gradient2: ['#6366F1', '#34D399'],
    gradient3: ['#34D399', '#06B6D4'],
  },
  
  roundness: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 999,
  },
  
  fonts: { fontFamily: 'System' },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    xxl: 32,
    xxxl: 40,
  },
  
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: '700',
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    },
    title: {
      fontSize: 18,
      fontWeight: '600',
      lineHeight: 26,
    },
    body: {
      fontSize: 16,
      fontWeight: '400',
      lineHeight: 24,
    },
    bodySm: {
      fontSize: 14,
      fontWeight: '400',
      lineHeight: 20,
    },
    caption: {
      fontSize: 12,
      fontWeight: '500',
      lineHeight: 16,
    },
  },
  
  shadows: {
    none: null,
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 12,
      elevation: 6,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.6,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};
