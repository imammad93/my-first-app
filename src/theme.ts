export const colors = {
  background: '#FFF8E7',
  math: '#4CAF7A',
  english: '#8B7CF6',
  alphabet: '#FFC145',
  home: '#8B6BFF',
  correct: '#4CAF50',
  wrong: '#E8756B',
  text: '#2E2A4A',
  white: '#FFFFFF',
  optionDefault: '#FFFFFF',
};

/** Deep-to-light gradient pairs per subject, used for scene backgrounds and glossy buttons. */
export const gradients = {
  math: ['#3D9463', '#63C98B'] as const,
  english: ['#6E5DDB', '#A594FF'] as const,
  alphabet: ['#E8A616', '#FFD666'] as const,
  home: ['#6D4FDB', '#A78BFA'] as const,
  motion: ['#3E86C2', '#8AD1F5'] as const,
  compare: ['#C2447E', '#F2A8CB'] as const,
  colorsGame: ['#D9720F', '#FFC26B'] as const,
  clock: ['#2E6FAE', '#79C1F2'] as const,
};

/** A soft top-light overlay to give any solid-colored surface a glossy, 3D-ish sheen. */
export const glossOverlay = 'rgba(255,255,255,0.35)';

export const fonts = {
  /** Baloo2 ExtraBold — big titles, hero numbers */
  display: 'Baloo2_800ExtraBold',
  /** Baloo2 Bold — section titles, headers */
  displayBold: 'Baloo2_700Bold',
  /** Fredoka SemiBold — buttons, option labels */
  button: 'Fredoka_600SemiBold',
  /** Fredoka Bold — emphasis within buttons */
  buttonBold: 'Fredoka_700Bold',
};
