import React from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import HomeMenuExact from './HomeMenuExact';

type Props = NativeStackScreenProps<RootStackParamList, 'HomeMenu'>;

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
      case 'motion-quiz':
        navigation.navigate('MotionQuiz');
        return;
      case 'numbers':
        navigation.navigate('Numbers');
        return;
      case 'compare':
        navigation.navigate('Compare');
        return;
      case 'colors':
        navigation.navigate('Colors');
        return;
      case 'shapes':
        navigation.navigate('Shapes');
        return;
      case 'clock':
        navigation.navigate('Clock');
        return;
      case 'achievements':
        navigation.navigate('Achievements');
        return;
      case 'music':
        navigation.navigate('Music');
        return;
      case 'daily':
        navigation.navigate('Daily');
        return;
      case 'gift':
        navigation.navigate('Gift');
        return;
      case 'parent':
        navigation.navigate('Parent');
        return;
      case 'settings':
        navigation.navigate('Home');
        return;
      case 'home':
      case 'learn':
        // Already on the main menu.
        return;
      case 'store':
        // No coin/currency system exists yet — an honest "coming soon" beats a fake shop.
        navigation.navigate('ComingSoon', { title: 'Mağaza' });
        return;
      default:
        navigation.navigate('ComingSoon', { title: route });
    }
  };

  return <HomeMenuExact onNavigate={handleNavigate} />;
}
