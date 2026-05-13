// BookSentinel colour tokens — maps to NativeWind + React Navigation
// Primary palette is cream/coral/brown (see Theme.ts for raw values).

const tintColorLight = '#C15F3C'; // primary coral
const tintColorDark  = '#D97757'; // primary2

export default {
  light: {
    text:           '#2A1810',
    background:     '#F4EDDF',
    tint:           tintColorLight,
    tabIconDefault: '#8B7355',
    tabIconSelected: tintColorLight,
    card:           '#FAF6EC',
    border:         'rgba(64,38,22,0.12)',
    muted:          '#8B7355',
  },
  dark: {
    text:           '#FFF8EC',
    background:     '#1a1207',
    tint:           tintColorDark,
    tabIconDefault: '#8B7355',
    tabIconSelected: tintColorDark,
    card:           '#2A1810',
    border:         'rgba(255,248,236,0.15)',
    muted:          '#8B7355',
  },
};
