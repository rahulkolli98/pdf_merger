/**
 * Design Tokens - Centralized color and styling configuration
 * ColorHunt Palette: https://colorhunt.co/palette/9bb4c0e1d0b3a18d6d703b3b
 */

export const colors = {
  // Brand Colors
  primary: '#9BB4C0',      // Soft blue-gray
  secondary: '#E1D0B3',    // Warm beige
  accent: '#A18D6D',       // Muted brown
  neutral: '#703B3B',      // Dark burgundy
  
  // Base Colors
  white: '#FFFFFF',
  offWhite: '#F8FAFC',     // Slate-50
  
  // Border Colors
  borderLight: '#F1F5F9',  // Slate-100
  border: '#E2E8F0',       // Slate-200
  borderDark: '#CBD5E1',   // Slate-300
  
  // Text Colors
  textPrimary: '#703B3B',   // Burgundy - main text
  textSecondary: '#64748B', // Slate-500
  textMuted: '#94A3B8',     // Slate-400
  textLight: '#CBD5E1',     // Slate-300
  
  // Background Colors
  bgPrimary: '#FFFFFF',
  bgSecondary: '#F8FAFC',   // Slate-50
  bgTertiary: '#F1F5F9',    // Slate-100
  
  // Semantic Colors
  success: '#10B981',       // Emerald-500
  error: '#EF4444',         // Red-500
  warning: '#F59E0B',       // Amber-500
  info: '#9BB4C0',          // Same as primary
} as const;

export const spacing = {
  xs: '0.5rem',    // 8px
  sm: '1rem',      // 16px
  md: '1.5rem',    // 24px
  lg: '2rem',      // 32px
  xl: '3rem',      // 48px
  '2xl': '4rem',   // 64px
  '3xl': '6rem',   // 96px
  '4xl': '8rem',   // 128px
} as const;

export const borderRadius = {
  sm: '0.375rem',  // 6px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  '3xl': '2rem',   // 32px
  full: '9999px',  // Fully rounded
} as const;

export const shadows = {
  sm: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
} as const;

export const typography = {
  fontFamily: {
    base: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", sans-serif',
  },
  fontSize: {
    hero: '4.5rem',      // 72px
    h1: '3rem',          // 48px
    h2: '2.25rem',       // 36px
    h3: '1.5rem',        // 24px
    bodyLg: '1.125rem',  // 18px
    body: '1rem',        // 16px
    small: '0.875rem',   // 14px
    tiny: '0.75rem',     // 12px
  },
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

// Export all tokens as a single object
export const designTokens = {
  colors,
  spacing,
  borderRadius,
  shadows,
  typography,
} as const;

export default designTokens;
