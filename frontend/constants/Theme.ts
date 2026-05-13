// BookSentinel design tokens — cream/coral/brown palette
// Matches the Journey design system from BookSentinel Journey.html

export const C = {
  // Backgrounds
  bg0: '#F4EDDF',  // main screen background
  bg1: '#ECE2CC',  // subtle variant
  bg2: '#FAF6EC',  // card background
  bg3: '#E2D5BA',  // pressed / border fill

  // Dividers
  line:  'rgba(64,38,22,0.12)',
  line2: 'rgba(64,38,22,0.22)',

  // Foregrounds
  fg1: '#2A1810',  // primary text
  fg2: '#5C4632',  // secondary text
  fg3: '#8B7355',  // muted / labels
  fg4: '#B8A687',  // very muted

  // Brand
  primary:     '#C15F3C',
  primary2:    '#D97757',
  primarySoft: 'rgba(193,95,60,0.10)',

  // Semantic
  success:         '#6B7F4A',
  successSoft:     'rgba(107,127,74,0.12)',
  warning:         '#C8841C',
  warningSoft:     'rgba(200,132,28,0.12)',
  destructive:     '#A4361F',
  destructiveSoft: 'rgba(164,54,31,0.10)',

  // Lock-screen dark
  dark: '#1a1207',
  darkText: '#FFF8EC',
} as const;

export const FONT = {
  sans: '-apple-system' as const,  // React Native maps this to system font
  mono: 'Courier New' as const,    // closest built-in mono on iOS & Android
} as const;

export function riskColor(score: number): string {
  if (score >= 85) return C.destructive;
  if (score >= 70) return C.warning;
  if (score >= 40) return C.primary;
  return C.success;
}
