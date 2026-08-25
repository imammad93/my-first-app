import { shuffle, pickOne } from '../utils/random';
import { generateUniqueSet } from '../utils/uniqueSet';

export type ShapeType = 'triangle' | 'circle' | 'square' | 'star' | 'rectangle' | 'pentagon';

export type ShapeDef = { name: string; type: ShapeType };

export const SHAPES: ShapeDef[] = [
  { name: 'Üçbucaq', type: 'triangle' },
  { name: 'Dairə', type: 'circle' },
  { name: 'Kvadrat', type: 'square' },
  { name: 'Ulduz', type: 'star' },
  { name: 'Düzbucaqlı', type: 'rectangle' },
  { name: 'Beşbucaqlı', type: 'pentagon' },
];

export type ShapeQuestion = {
  target: ShapeDef;
  options: ShapeDef[];
};

export function generateShapeQuestion(): ShapeQuestion {
  const target = pickOne(SHAPES);
  const distractors = shuffle(SHAPES.filter((s) => s.name !== target.name)).slice(0, 2);
  const options = shuffle([target, ...distractors]);
  return { target, options };
}

export function generateShapeSet(count: number): ShapeQuestion[] {
  return generateUniqueSet(generateShapeQuestion, (q) => q.target.name, count);
}
