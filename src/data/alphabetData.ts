import { pickOne, shuffle } from '../utils/random';
import { AlphabetMode } from './difficulty';
import { MotionType } from './motion';

export type LetterItem = {
  letter: string;
  emoji: string;
  word: string;
  motion: MotionType;
};

export const letterItems: LetterItem[] = [
  { letter: 'A', emoji: '🍎', word: 'Apple', motion: 'idle' },
  { letter: 'B', emoji: '⚽', word: 'Ball', motion: 'hop' },
  { letter: 'C', emoji: '🐱', word: 'Cat', motion: 'walk' },
  { letter: 'D', emoji: '🐶', word: 'Dog', motion: 'walk' },
  { letter: 'E', emoji: '🥚', word: 'Egg', motion: 'idle' },
  { letter: 'F', emoji: '🐟', word: 'Fish', motion: 'swim' },
  { letter: 'G', emoji: '🍇', word: 'Grapes', motion: 'idle' },
  { letter: 'H', emoji: '🏠', word: 'House', motion: 'idle' },
  { letter: 'I', emoji: '🍦', word: 'Ice cream', motion: 'idle' },
  { letter: 'J', emoji: '🧃', word: 'Juice', motion: 'idle' },
  { letter: 'K', emoji: '🔑', word: 'Key', motion: 'idle' },
  { letter: 'L', emoji: '🦁', word: 'Lion', motion: 'walk' },
  { letter: 'M', emoji: '🌙', word: 'Moon', motion: 'idle' },
  { letter: 'N', emoji: '🥜', word: 'Nut', motion: 'idle' },
  { letter: 'O', emoji: '🍊', word: 'Orange', motion: 'idle' },
  { letter: 'P', emoji: '🐷', word: 'Pig', motion: 'walk' },
  { letter: 'Q', emoji: '👑', word: 'Queen', motion: 'idle' },
  { letter: 'R', emoji: '🐰', word: 'Rabbit', motion: 'hop' },
  { letter: 'S', emoji: '☀️', word: 'Sun', motion: 'idle' },
  { letter: 'T', emoji: '🌳', word: 'Tree', motion: 'idle' },
  { letter: 'U', emoji: '☂️', word: 'Umbrella', motion: 'idle' },
  { letter: 'V', emoji: '🎻', word: 'Violin', motion: 'idle' },
  { letter: 'W', emoji: '⌚', word: 'Watch', motion: 'idle' },
  { letter: 'X', emoji: '🩻', word: 'X-ray', motion: 'idle' },
  { letter: 'Y', emoji: '🪀', word: 'Yo-yo', motion: 'hop' },
  { letter: 'Z', emoji: '🦓', word: 'Zebra', motion: 'walk' },
];

export type AlphabetQuestion = {
  mode: AlphabetMode;
  target: LetterItem;
  /** For pick-picture modes: the letter items to choose from. For pick-letter: unused. */
  itemOptions: LetterItem[];
  /** For pick-letter mode: the letters to choose from. */
  letterOptions: string[];
};

export function generateAlphabetQuestion(mode: AlphabetMode): AlphabetQuestion {
  const target = pickOne(letterItems);
  const distractors = shuffle(letterItems.filter((item) => item.letter !== target.letter));

  if (mode === 'pick-letter') {
    const distractorLetters = distractors.slice(0, 3).map((item) => item.letter);
    return {
      mode,
      target,
      itemOptions: [],
      letterOptions: shuffle([target.letter, ...distractorLetters]),
    };
  }

  const itemOptions = shuffle([target, ...distractors.slice(0, 2)]);
  return { mode, target, itemOptions, letterOptions: [] };
}
