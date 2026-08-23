import { pickOne, shuffle } from '../utils/random';

export type WordCard = {
  emoji: string;
  word: string;
};

export const wordCards: WordCard[] = [
  { emoji: '🐱', word: 'Cat' },
  { emoji: '🐶', word: 'Dog' },
  { emoji: '🐮', word: 'Cow' },
  { emoji: '🐷', word: 'Pig' },
  { emoji: '🐰', word: 'Rabbit' },
  { emoji: '🐟', word: 'Fish' },
  { emoji: '🐦', word: 'Bird' },
  { emoji: '🦁', word: 'Lion' },
  { emoji: '🍎', word: 'Apple' },
  { emoji: '🍌', word: 'Banana' },
  { emoji: '🍇', word: 'Grapes' },
  { emoji: '🍓', word: 'Strawberry' },
  { emoji: '☀️', word: 'Sun' },
  { emoji: '🌙', word: 'Moon' },
  { emoji: '⭐', word: 'Star' },
  { emoji: '🌳', word: 'Tree' },
  { emoji: '🏠', word: 'House' },
  { emoji: '🚗', word: 'Car' },
  { emoji: '📕', word: 'Book' },
  { emoji: '⚽', word: 'Ball' },
  { emoji: '🔴', word: 'Red' },
  { emoji: '🔵', word: 'Blue' },
  { emoji: '🟢', word: 'Green' },
  { emoji: '🟡', word: 'Yellow' },
];

export type EnglishQuestion = {
  card: WordCard;
  options: string[];
};

export function generateEnglishQuestion(): EnglishQuestion {
  const card = pickOne(wordCards);
  const distractors = shuffle(wordCards.filter((c) => c.word !== card.word)).slice(0, 2);
  const options = shuffle([card.word, ...distractors.map((c) => c.word)]);
  return { card, options };
}
