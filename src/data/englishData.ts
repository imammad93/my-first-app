import { pickOne, shuffle } from '../utils/random';
import { generateUniqueSet } from '../utils/uniqueSet';
import { MotionType } from './motion';
import { QUESTIONS_PER_LEVEL } from './difficulty';

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
  { emoji: '🧦', word: 'Sock', motion: 'idle' },
  { emoji: '👂', word: 'Ear', motion: 'idle' },
  { emoji: '👁️', word: 'Eye', motion: 'idle' },
  { emoji: '🐜', word: 'Ant', motion: 'walk' },
  { emoji: '🐝', word: 'Bee', motion: 'fly' },
  { emoji: '🦉', word: 'Owl', motion: 'fly' },
  { emoji: '🐔', word: 'Hen', motion: 'walk' },
  { emoji: '🧊', word: 'Ice', motion: 'idle' },
  { emoji: '🖊️', word: 'Pen', motion: 'idle' },
  { emoji: '🚌', word: 'Bus', motion: 'idle' },
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
  { emoji: '🐐', word: 'Goat', motion: 'walk' },
  { emoji: '🐑', word: 'Sheep', motion: 'walk' },
  { emoji: '🐭', word: 'Mouse', motion: 'walk' },
  { emoji: '🐍', word: 'Snake', motion: 'walk' },
  { emoji: '👞', word: 'Shoe', motion: 'idle' },
  { emoji: '🪁', word: 'Kite', motion: 'fly' },
  { emoji: '🪺', word: 'Nest', motion: 'idle' },
  { emoji: '☁️', word: 'Cloud', motion: 'idle' },
  { emoji: '🌧️', word: 'Rain', motion: 'idle' },
  { emoji: '🐌', word: 'Snail', motion: 'walk' },
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
  { emoji: '🎹', word: 'Piano', motion: 'idle' },
  { emoji: '🥁', word: 'Drum', motion: 'idle' },
  { emoji: '📷', word: 'Camera', motion: 'idle' },
  { emoji: '🎈', word: 'Balloon', motion: 'fly' },
  { emoji: '🤖', word: 'Robot', motion: 'walk' },
  { emoji: '🚀', word: 'Rocket', motion: 'fly' },
  { emoji: '🚲', word: 'Bicycle', motion: 'walk' },
  { emoji: '⛵', word: 'Boat', motion: 'swim' },
  { emoji: '🐳', word: 'Whale', motion: 'swim' },
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
  { emoji: '🐙', word: 'Octopus', motion: 'swim' },
  { emoji: '🐧', word: 'Penguin', motion: 'walk' },
  { emoji: '🦚', word: 'Peacock', motion: 'walk' },
  { emoji: '🦩', word: 'Flamingo', motion: 'walk' },
  { emoji: '🐿️', word: 'Squirrel', motion: 'hop' },
  { emoji: '🦔', word: 'Hedgehog', motion: 'walk' },
  { emoji: '🪼', word: 'Jellyfish', motion: 'swim' },
  { emoji: '🧭', word: 'Compass', motion: 'idle' },
  { emoji: '🎒', word: 'Backpack', motion: 'idle' },
  { emoji: '🌪️', word: 'Tornado', motion: 'idle' },
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
  { emoji: '🌌', word: 'Galaxy', motion: 'idle' },
  { emoji: '☄️', word: 'Comet', motion: 'fly' },
  { emoji: '🛰️', word: 'Satellite', motion: 'fly' },
  { emoji: '🧙', word: 'Wizard', motion: 'idle' },
  { emoji: '🏴‍☠️', word: 'Pirate', motion: 'idle' },
  { emoji: '👻', word: 'Ghost', motion: 'fly' },
  { emoji: '🧜', word: 'Mermaid', motion: 'swim' },
  { emoji: '💎', word: 'Diamond', motion: 'idle' },
  { emoji: '🏮', word: 'Lantern', motion: 'idle' },
  { emoji: '⚓', word: 'Anchor', motion: 'idle' },
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

export function generateEnglishQuestionSet(
  tier: number,
  count: number = QUESTIONS_PER_LEVEL
): EnglishQuestion[] {
  return generateUniqueSet(
    () => generateEnglishQuestion(tier),
    (q) => q.card.word,
    count
  );
}
