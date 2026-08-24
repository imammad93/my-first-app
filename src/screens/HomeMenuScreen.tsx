import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import HomeMenuExact from './HomeMenuExact';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeMenu'>;

const COMING_SOON_TITLES: Record<string, string> = {
  'motion-quiz': 'Hərəkəti Tap',
  numbers: 'Sayıları Öyrən',
  colors: 'Rənglər',
  compare: 'Daha Çox və ya Az?',
  clock: 'Saatı Öyrən',
  shapes: 'Formalar',
  achievements: 'Nailiyyətlər',
  daily: 'Gündəlik',
  store: 'Mağaza',
  parent: 'Valideyn',
  gift: 'Hədiyyə',
  music: 'Musiqi/Səs',
};

export default function HomeMenuScreen({ navigation }: Props) {
  const handleNavigate = (route: string) => {
    switch (route) {
      case 'math':
        navigation.navigate('LevelSelect', { game: 'Math' });
        return;
      case 'word-train':
        navigation.navigate('LevelSelect', { game: 'English' });
        return;
      case 'falling-letters':
        navigation.navigate('LevelSelect', { game: 'Alphabet' });
        return;
      case 'world':
        navigation.navigate('WorldMap');
        return;
      case 'settings':
        navigation.navigate('Home');
        return;
      case 'home':
      case 'learn':
        // Already on the main menu.
        return;
      default: {
        const title = COMING_SOON_TITLES[route] ?? route;
        navigation.navigate('ComingSoon', { title });
      }
    }
  };

  return <HomeMenuExact onNavigate={handleNavigate} />;
}
