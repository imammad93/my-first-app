import AsyncStorage from '@react-native-async-storage/async-storage';

const SOUND_KEY = 'soundEnabled';

export async function getSoundEnabled(): Promise<boolean> {
  const raw = await AsyncStorage.getItem(SOUND_KEY);
  return raw === null ? true : raw === 'true';
}

export async function setSoundEnabled(enabled: boolean): Promise<void> {
  await AsyncStorage.setItem(SOUND_KEY, String(enabled));
}
