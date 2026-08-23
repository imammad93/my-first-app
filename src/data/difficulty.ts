export const MIN_AGE = 4;
export const MAX_AGE = 10;
export const LEVELS_PER_AGE = 50;
export const QUESTIONS_PER_LEVEL = 20;

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

/** Combined 0..1 progress across the whole age+level journey (age weighs as much as level). */
export function difficultyProgress(age: number, level: number): number {
  const ageT = clamp(age - MIN_AGE, 0, MAX_AGE - MIN_AGE) / (MAX_AGE - MIN_AGE);
  const levelT = clamp(level - 1, 0, LEVELS_PER_AGE - 1) / (LEVELS_PER_AGE - 1);
  return clamp(ageT * 0.5 + levelT * 0.5, 0, 1);
}

export function difficultyTier(age: number, level: number, tierCount: number): number {
  const t = difficultyProgress(age, level);
  return clamp(Math.floor(t * tierCount), 0, tierCount - 1);
}

export type MathOp = '+' | '-' | '×' | '÷';

export type MathDifficulty = {
  maxNumber: number;
  multiplierMax: number;
  ops: MathOp[];
};

export function mathDifficultyFor(age: number, level: number): MathDifficulty {
  const t = difficultyProgress(age, level);
  const maxNumber = Math.round(lerp(5, 200, t));
  const multiplierMax = Math.round(lerp(2, 12, t));

  const ops: MathOp[] = ['+', '-'];
  if (t >= 0.35) ops.push('×');
  if (t >= 0.55) ops.push('÷');

  return { maxNumber, multiplierMax, ops };
}

export const ENGLISH_TIER_COUNT = 5;

export function englishTierFor(age: number, level: number): number {
  return difficultyTier(age, level, ENGLISH_TIER_COUNT);
}

export type AlphabetMode = 'pick-picture-upper' | 'pick-picture-lower' | 'pick-letter';

export function alphabetModeFor(age: number, level: number): AlphabetMode {
  const tier = difficultyTier(age, level, 5);
  if (tier <= 1) return 'pick-picture-upper';
  if (tier <= 3) return 'pick-picture-lower';
  return 'pick-letter';
}
