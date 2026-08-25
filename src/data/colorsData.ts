import { shuffle, pickOne } from '../utils/random';
import { generateUniqueSet } from '../utils/uniqueSet';

export type ColorDef = { name: string; hex: string };

export const COLORS: ColorDef[] = [
  { name: 'Qırmızı', hex: '#E8564B' },
  { name: 'Sarı', hex: '#FFC145' },
  { name: 'Yaşıl', hex: '#4CAF7A' },
  { name: 'Göy', hex: '#4A9FE0' },
  { name: 'Narıncı', hex: '#FF9F3D' },
  { name: 'Bənövşəyi', hex: '#8B7CF6' },
  { name: 'Çəhrayı', hex: '#FF6FA5' },
];

export type ColorQuestion = {
  target: ColorDef;
  options: ColorDef[];
};

export function generateColorQuestion(): ColorQuestion {
  const target = pickOne(COLORS);
  const distractors = shuffle(COLORS.filter((c) => c.name !== target.name)).slice(0, 2);
  const options = shuffle([target, ...distractors]);
  return { target, options };
}

export function generateColorSet(count: number): ColorQuestion[] {
  return generateUniqueSet(generateColorQuestion, (q) => q.target.name, count);
}
