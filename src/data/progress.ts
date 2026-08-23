import AsyncStorage from '@react-native-async-storage/async-storage';
import { LEVELS_PER_AGE, MIN_AGE } from './difficulty';

export type GameId = 'Math' | 'English' | 'Alphabet';

const AGE_KEY = 'selectedAge';

function unlockedKey(game: GameId, age: number): string {
  return `unlocked:${game}:${age}`;
}

export async function getSelectedAge(): Promise<number> {
  const raw = await AsyncStorage.getItem(AGE_KEY);
  const age = raw ? parseInt(raw, 10) : MIN_AGE + 2;
  return Number.isFinite(age) ? age : MIN_AGE + 2;
}

export async function setSelectedAge(age: number): Promise<void> {
  await AsyncStorage.setItem(AGE_KEY, String(age));
}

export async function getUnlockedLevel(game: GameId, age: number): Promise<number> {
  const raw = await AsyncStorage.getItem(unlockedKey(game, age));
  const level = raw ? parseInt(raw, 10) : 1;
  return Number.isFinite(level) ? level : 1;
}

export async function unlockNextLevel(game: GameId, age: number, completedLevel: number): Promise<number> {
  const current = await getUnlockedLevel(game, age);
  const next = Math.min(LEVELS_PER_AGE, Math.max(current, completedLevel + 1));
  await AsyncStorage.setItem(unlockedKey(game, age), String(next));
  return next;
}
