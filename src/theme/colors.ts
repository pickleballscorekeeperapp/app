/**
 * Pickleball Score Keeper color tokens.
 * Ported from the CourtsideView v11 design canon (light cream + green primary),
 * with a pickleball accent set: optic-yellow ball + court blue.
 * Light-only at launch.
 */
export const colors = {
  // Surfaces
  canvas: '#F1F3F7',
  bg: '#F7F8FB',
  bgElevated: '#FFFFFF',
  bgElevated2: '#EEF2F7',
  border: '#E6E8EE',
  borderStrong: '#CAD0DA',
  scrim: 'rgba(10,13,18,0.42)',

  // Text
  text: '#111827',
  text2: '#243044',
  textMuted: '#6B7280',
  textDim: '#7B8394',

  // Brand & accents
  green: '#20A66B',
  greenSoft: 'rgba(32,166,107,0.13)',
  ball: '#D9A800', // optic-yellow pickleball, darkened for text contrast on light bg
  ballBright: '#E8C436', // fills / icons
  ballSoft: 'rgba(217,168,0,0.16)',
  courtBlue: '#3B6FB5',
  red: '#DC2626',
  redSoft: 'rgba(220,38,38,0.10)',

  // Team identities (Team 1 = blue, Team 2 = green)
  teamA: '#2563EB',
  teamASoft: 'rgba(37,99,235,0.10)',
  teamAPressed: 'rgba(37,99,235,0.20)',
  teamB: '#20A66B',
  teamBSoft: 'rgba(32,166,107,0.12)',
  teamBPressed: 'rgba(32,166,107,0.22)',
} as const;

export type ColorToken = keyof typeof colors;
