import { randomInt, shuffle } from '../utils/random';
import { generateUniqueSet } from '../utils/uniqueSet';

const OBJECT_EMOJIS = ['🍎', '⭐', '🎈', '🐸', '🍓', '🚗', '🦋', '🐬'];

export type NumberQuestion = {
  count: number;
  emoji: string;
  options: number[];
};

function distractorsFor(answer: number): number[] {
  const pool = new Set<number>();
  while (pool.size < 2) {
    const delta = randomInt(-3, 3);
    const candidate = answer + delta;
    if (candidate >= 1 && candidate <= 10 && candidate !== answer) {
      pool.add(candidate);
    }
  }
  return [...pool];
}

export function generateNumberQuestion(): NumberQuestion {
  const count = randomInt(1, 10);
  const emoji = OBJECT_EMOJIS[randomInt(0, OBJECT_EMOJIS.length - 1)];
  const options = shuffle([count, ...distractorsFor(count)]);
  return { count, emoji, options };
}

export function generateNumberSet(count: number): NumberQuestion[] {
  return generateUniqueSet(generateNumberQuestion, (q) => String(q.count) + q.emoji, count);
}
