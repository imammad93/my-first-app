import { randomInt, shuffle } from '../utils/random';

export type MathQuestion = {
  a: number;
  b: number;
  op: '+' | '-';
  answer: number;
  options: number[];
};

function distractorsFor(answer: number): number[] {
  const pool = new Set<number>();
  while (pool.size < 2) {
    const delta = randomInt(-3, 3);
    const candidate = answer + delta;
    if (candidate >= 0 && candidate !== answer) {
      pool.add(candidate);
    }
  }
  return [...pool];
}

export function generateMathQuestion(): MathQuestion {
  const isAddition = Math.random() < 0.6;

  if (isAddition) {
    const a = randomInt(1, 9);
    const b = randomInt(1, 9 - a >= 1 ? 9 - a : 1);
    const answer = a + b;
    const options = shuffle([answer, ...distractorsFor(answer)]);
    return { a, b, op: '+', answer, options };
  }

  const a = randomInt(2, 10);
  const b = randomInt(1, a);
  const answer = a - b;
  const options = shuffle([answer, ...distractorsFor(answer)]);
  return { a, b, op: '-', answer, options };
}

export function emojiRow(count: number): string {
  return '🍎'.repeat(count);
}
