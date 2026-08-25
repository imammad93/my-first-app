import { englishTiers, WordCard } from './englishData';
import { pickOne, shuffle } from '../utils/random';
import { generateUniqueSet } from '../utils/uniqueSet';
import { MotionType } from './motion';

export const MOTION_LABELS: Record<MotionType, string> = {
  fly: 'uçur',
  walk: 'yeriyir',
  swim: 'üzür',
  hop: 'tullanır',
  idle: '',
};

const MOVING_MOTIONS: MotionType[] = ['fly', 'walk', 'swim', 'hop'];

const pool: WordCard[] = (() => {
  const seen = new Set<string>();
  const items: WordCard[] = [];
  for (const tier of englishTiers) {
    for (const card of tier) {
      if (!MOVING_MOTIONS.includes(card.motion)) continue;
      if (seen.has(card.word)) continue;
      seen.add(card.word);
      items.push(card);
    }
  }
  return items;
})();

export type MotionQuizQuestion = {
  motion: MotionType;
  correctWord: string;
  options: WordCard[];
};

function byMotion(motion: MotionType): WordCard[] {
  return pool.filter((c) => c.motion === motion);
}

export function generateMotionQuizQuestion(): MotionQuizQuestion {
  const motion = pickOne(MOVING_MOTIONS);
  const correct = pickOne(byMotion(motion));
  const others = shuffle(pool.filter((c) => c.motion !== motion && c.word !== correct.word)).slice(0, 3);
  const options = shuffle([correct, ...others]);
  return { motion, correctWord: correct.word, options };
}

export function generateMotionQuizSet(count: number): MotionQuizQuestion[] {
  return generateUniqueSet(generateMotionQuizQuestion, (q) => q.correctWord, count);
}
