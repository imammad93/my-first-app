import { randomInt } from '../utils/random';
import { generateUniqueSet } from '../utils/uniqueSet';

const FRUITS = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌'];

export type CompareQuestion = {
  left: number;
  right: number;
  emoji: string;
  askMore: boolean; // true = "which has more", false = "which has fewer"
  correctSide: 'left' | 'right';
};

export function generateCompareQuestion(): CompareQuestion {
  let left = randomInt(1, 9);
  let right = randomInt(1, 9);
  while (right === left) {
    right = randomInt(1, 9);
  }
  const emoji = FRUITS[randomInt(0, FRUITS.length - 1)];
  const askMore = Math.random() < 0.5;
  const correctSide: 'left' | 'right' = askMore ? (left > right ? 'left' : 'right') : left < right ? 'left' : 'right';
  return { left, right, emoji, askMore, correctSide };
}

export function generateCompareSet(count: number): CompareQuestion[] {
  return generateUniqueSet(generateCompareQuestion, (q) => `${q.left}:${q.right}:${q.askMore}`, count);
}
