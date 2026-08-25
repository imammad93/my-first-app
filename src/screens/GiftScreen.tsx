import React, { useCallback, useState } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useAge } from '../context/AgeContext';
import { getUnlockedLevel, GameId } from '../data/progress';
import { colors, fonts } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Gift'>;

const GAMES: GameId[] = ['Math', 'English', 'Alphabet'];

export default function GiftScreen({}: Props) {
  const { age } = useAge();
  const [totalCompleted, setTotalCompleted] = useState(0);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      Promise.all(GAMES.map((g) => getUnlockedLevel(g, age))).then((levels) => {
        if (!active) return;
        setTotalCompleted(levels.reduce((sum, l) => sum + Math.max(0, l - 1), 0));
      });
      return () => {
        active = false;
      };
    }, [age])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.emoji}>🎁</Text>
      <Text style={styles.title}>İndiyədək {totalCompleted} səviyyə bitirmisən!</Text>
      <Text style={styles.subtitle}>
        Hər tamamlanan səviyyə üçün ulduzlar qazanırsan. Mağaza və hədiyyə mükafatları tezliklə əlavə olunacaq —
        hazırda burada nailiyyətlərini görə bilərsən.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 8,
  },
  emoji: { fontSize: 56 },
  title: {
    fontSize: 20,
    fontFamily: fonts.display,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.button,
    color: colors.text,
    opacity: 0.65,
    textAlign: 'center',
    marginTop: 8,
  },
});
