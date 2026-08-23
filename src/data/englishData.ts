import { pickOne, shuffle } from '../utils/random';

export type WordCard = {
  emoji: string;
  word: string;
};

const tier0: WordCard[] = [
  { emoji: '🐱', word: 'Cat' },
  { emoji: '🐶', word: 'Dog' },
  { emoji: '☀️', word: 'Sun' },
  { emoji: '🐮', word: 'Cow' },
  { emoji: '🐷', word: 'Pig' },
  { emoji: '🎩', word: 'Hat' },
  { emoji: '☕', word: 'Cup' },
  { emoji: '📦', word: 'Box' },
  { emoji: '🛏️', word: 'Bed' },
  { emoji: '🥚', word: 'Egg' },
];

const tier1: WordCard[] = [
  { emoji: '🐟', word: 'Fish' },
  { emoji: '🐦', word: 'Bird' },
  { emoji: '🦁', word: 'Lion' },
  { emoji: '🐸', word: 'Frog' },
  { emoji: '🦆', word: 'Duck' },
  { emoji: '⭐', word: 'Star' },
  { emoji: '🌙', word: 'Moon' },
  { emoji: '🌳', word: 'Tree' },
  { emoji: '📕', word: 'Book' },
  { emoji: '⚽', word: 'Ball' },
];

const tier2: WordCard[] = [
  { emoji: '🍎', word: 'Apple' },
  { emoji: '🍇', word: 'Grapes' },
  { emoji: '🏠', word: 'House' },
  { emoji: '🐰', word: 'Rabbit' },
  { emoji: '🟡', word: 'Yellow' },
  { emoji: '🍊', word: 'Orange' },
  { emoji: '🟣', word: 'Purple' },
  { emoji: '🐒', word: 'Monkey' },
  { emoji: '🐢', word: 'Turtle' },
  { emoji: '🎸', word: 'Guitar' },
];

const tier3: WordCard[] = [
  { emoji: '🐘', word: 'Elephant' },
  { emoji: '🦋', word: 'Butterfly' },
  { emoji: '☂️', word: 'Umbrella' },
  { emoji: '🦖', word: 'Dinosaur' },
  { emoji: '⛰️', word: 'Mountain' },
  { emoji: '🍫', word: 'Chocolate' },
  { emoji: '🍓', word: 'Strawberry' },
  { emoji: '🦘', word: 'Kangaroo' },
  { emoji: '🐊', word: 'Alligator' },
  { emoji: '🚁', word: 'Helicopter' },
];

const tier4: WordCard[] = [
  { emoji: '🚀', word: 'Astronaut' },
  { emoji: '🌋', word: 'Volcano' },
  { emoji: '🔭', word: 'Telescope' },
  { emoji: '🌊', word: 'Waterfall' },
  { emoji: '🌈', word: 'Rainbow' },
  { emoji: '🗺️', word: 'Adventure' },
  { emoji: '💰', word: 'Treasure' },
  { emoji: '🐉', word: 'Dragon' },
  { emoji: '🏰', word: 'Castle' },
  { emoji: '🏝️', word: 'Island' },
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
