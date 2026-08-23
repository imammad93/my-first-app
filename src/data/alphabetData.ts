import { pickOne, shuffle } from '../utils/random';

export type LetterItem = {
  letter: string;
  emoji: string;
  word: string;
};

export const letterItems: LetterItem[] = [
  { letter: 'A', emoji: '🍎', word: 'Apple' },
  { letter: 'B', emoji: '⚽', word: 'Ball' },
  { letter: 'C', emoji: '🐱', word: 'Cat' },
  { letter: 'D', emoji: '🐶', word: 'Dog' },
  { letter: 'E', emoji: '🥚', word: 'Egg' },
  { letter: 'F', emoji: '🐟', word: 'Fish' },
  { letter: 'G', emoji: '🍇', word: 'Grapes' },
  { letter: 'H', emoji: '🏠', word: 'House' },
  { letter: 'I', emoji: '🍦', word: 'Ice cream' },
  { letter: 'J', emoji: '🧃', word: 'Juice' },
  { letter: 'K', emoji: '🔑', word: 'Key' },
  { letter: 'L', emoji: '🦁', word: 'Lion' },
  { letter: 'M', emoji: '🌙', word: 'Moon' },
  { letter: 'N', emoji: '🥜', word: 'Nut' },
  { letter: 'O', emoji: '🍊', word: 'Orange' },
  { letter: 'P', emoji: '🐷', word: 'Pig' },
  { letter: 'Q', emoji: '👸', word: 'Queen' },
  { letter: 'R', emoji: '🐰', word: 'Rabbit' },
  { letter: 'S', emoji: '☀️', word: 'Sun' },
  { letter: 'T', emoji: '🌳', word: 'Tree' },
  { letter: 'U', emoji: '☂️', word: 'Umbrella' },
  { letter: 'V', emoji: '🎻', word: 'Violin' },
  { letter: 'W', emoji: '⌚', word: 'Watch' },
  { letter: 'X', emoji: '🎷', word: 'Saxophone' },
  { letter: 'Y', emoji: '🪀', word: 'Yo-yo' },
  { letter: 'Z', emoji: '🦓', word: 'Zebra' },
];

export type AlphabetQuestion = {
  target: LetterItem;
  options: LetterItem[];
};

export function generateAlphabetQuestion(): AlphabetQuestion {
  const target = pickOne(letterItems);
  const distractors = shuffle(
    letterItems.filter((item) => item.letter !== target.letter)
  ).slice(0, 2);
  const options = shuffle([target, ...distractors]);
  return { target, options };
}
