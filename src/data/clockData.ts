import { randomInt, shuffle } from '../utils/random';
import { generateUniqueSet } from '../utils/uniqueSet';

export type ClockQuestion = {
  hour: number;
  options: number[];
};

function distractorHours(hour: number): number[] {
  const pool = new Set<number>();
  while (pool.size < 2) {
    const delta = randomInt(-4, 4);
    let candidate = ((hour - 1 + delta + 12) % 12) + 1;
    if (candidate !== hour) pool.add(candidate);
  }
  return [...pool];
}

export function generateClockQuestion(): ClockQuestion {
  const hour = randomInt(1, 12);
  const options = shuffle([hour, ...distractorHours(hour)]);
  return { hour, options };
}

export function generateClockSet(count: number): ClockQuestion[] {
  return generateUniqueSet(generateClockQuestion, (q) => String(q.hour), count);
}
