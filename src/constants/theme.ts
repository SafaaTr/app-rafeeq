// src/constants/theme.ts
import { Platform } from 'react-native';
import { colorPalette } from './colors';

export const Colors = {
  light: {
    text: colorPalette.navyDark,
    textSecondary: '#64748B',
    background: colorPalette.sandCream,
    backgroundElement: '#FFFFFF',
    backgroundSelected: colorPalette.softSand,
    primary: colorPalette.accentGold,
    secondary: colorPalette.softBlue,
    border: '#E2E8F0',
  },
  dark: {
    text: '#FFFFFF',
    textSecondary: '#94A3B8',
    background: '#121820',
    backgroundElement: '#1E2733',
    backgroundSelected: '#2A3648',
    primary: colorPalette.accentGold,
    secondary: colorPalette.softBlue,
    border: '#334155',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;