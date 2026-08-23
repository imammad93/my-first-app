import { pickOne, shuffle } from '../utils/random';
import { MotionType } from './motion';

export type WordCard = {
  emoji: string;
  word: string;
  motion: MotionType;
};

const tier0: WordCard[] = [
  { emoji: '🐱', word: 'Cat', motion: 'walk' },
  { emoji: '🐶', word: 'Dog', motion: 'walk' },
  { emoji: '☀️', word: 'Sun', motion: 'idle' },
  { emoji: '🐮', word: 'Cow', motion: 'walk' },
  { emoji: '🐷', word: 'Pig', motion: 'walk' },
  { emoji: '🎩', word: 'Hat', motion: 'idle' },
  { emoji: '☕', word: 'Cup', motion: 'idle' },
  { emoji: '📦', word: 'Box', motion: 'idle' },
  { emoji: '🛏️', word: 'Bed', motion: 'idle' },
  { emoji: '🥚', word: 'Egg', motion: 'idle' },
];

const tier1: WordCard[] = [
  { emoji: '🐟', word: 'Fish', motion: 'swim' },
  { emoji: '🐦', word: 'Bird', motion: 'fly' },
  { emoji: '🦁', word: 'Lion', motion: 'walk' },
  { emoji: '🐸', word: 'Frog', motion: 'hop' },
  { emoji: '🦆', word: 'Duck', motion: 'walk' },
  { emoji: '⭐', word: 'Star', motion: 'idle' },
  { emoji: '🌙', word: 'Moon', motion: 'idle' },
  { emoji: '🌳', word: 'Tree', motion: 'idle' },
  { emoji: '📕', word: 'Book', motion: 'idle' },
  { emoji: '⚽', word: 'Ball', motion: 'hop' },
];

const tier2: WordCard[] = [
  { emoji: '🍎', word: 'Apple', motion: 'idle' },
  { emoji: '🍇', word: 'Grapes', motion: 'idle' },
  { emoji: '🏠', word: 'House', motion: 'idle' },
  { emoji: '🐰', word: 'Rabbit', motion: 'hop' },
  { emoji: '🟡', word: 'Yellow', motion: 'idle' },
  { emoji: '🍊', word: 'Orange', motion: 'idle' },
  { emoji: '🟣', word: 'Purple', motion: 'idle' },
  { emoji: '🐒', word: 'Monkey', motion: 'hop' },
  { emoji: '🐢', word: 'Turtle', motion: 'walk' },
  { emoji: '🎸', word: 'Guitar', motion: 'idle' },
  { emoji: '✈️', word: 'Airplane', motion: 'fly' },
];

const tier3: WordCard[] = [
  { emoji: '🐘', word: 'Elephant', motion: 'walk' },
  { emoji: '🦋', word: 'Butterfly', motion: 'fly' },
  { emoji: '☂️', word: 'Umbrella', motion: 'idle' },
  { emoji: '🦖', word: 'Dinosaur', motion: 'walk' },
  { emoji: '⛰️', word: 'Mountain', motion: 'idle' },
  { emoji: '🍫', word: 'Chocolate', motion: 'idle' },
  { emoji: '🍓', word: 'Strawberry', motion: 'idle' },
  { emoji: '🦘', word: 'Kangaroo', motion: 'hop' },
  { emoji: '🐊', word: 'Alligator', motion: 'swim' },
  { emoji: '🚁', word: 'Helicopter', motion: 'fly' },
];

const tier4: WordCard[] = [
  { emoji: '🚀', word: 'Astronaut', motion: 'fly' },
  { emoji: '🌋', word: 'Volcano', motion: 'idle' },
  { emoji: '🔭', word: 'Telescope', motion: 'idle' },
  { emoji: '🌊', word: 'Waterfall', motion: 'idle' },
  { emoji: '🌈', word: 'Rainbow', motion: 'idle' },
  { emoji: '🗺️', word: 'Adventure', motion: 'idle' },
  { emoji: '💰', word: 'Treasure', motion: 'idle' },
  { emoji: '🐉', word: 'Dragon', motion: 'fly' },
  { emoji: '🏰', word: 'Castle', motion: 'idle' },
  { emoji: '🏝️', word: 'Island', motion: 'idle' },
];

export const englishTiers: WordCard[][] = [tier0, tier1, tier2, tier3, tier4];

export type EnglishQuestion = {
  card: WordCard;
  options: string[];
};

export function generateEnglishQuestion(tier: number): EnglishQuestion {
  const pool = englishTiers[Math.min(tier, englishTiers.length - 1)];
  const card = pickOne(pool);
  const distractors = shuffle(pool.filter((c) => c.word !== card.word)).slice(0, 2);
  const options = shuffle([card.word, ...distractors.map((c) => c.word)]);
  return { card, options };
}
