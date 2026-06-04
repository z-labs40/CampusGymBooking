export const Colors = {
  primary: '#10B981', // Emerald 500
  primaryLight: '#34D399', // Emerald 400
  secondary: '#3B82F6', // Blue 500
  background: '#0F172A', // Slate 900
  card: 'rgba(30, 41, 59, 0.65)', // Slate 800 with opacity for glass
  text: '#F8FAFC',
  textMuted: '#94A3B8',
  border: 'rgba(255, 255, 255, 0.15)',
  error: '#EF4444',
  success: '#10B981',
  waitlist: '#F59E0B', // Amber
  glassBackdrop: 'rgba(15, 23, 42, 0.85)',
};

export const Gradients = {
  primary: ['#047857', '#10B981'] as const,
  secondary: ['#1D4ED8', '#3B82F6'] as const,
  background: ['#0F172A', '#020617'] as const,
};

export const Shadows = {
  glass: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Typography = {
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: Colors.text,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  body: {
    fontSize: 16,
    color: Colors.text,
  },
  bodySmall: {
    fontSize: 14,
    color: Colors.textMuted,
  },
};
