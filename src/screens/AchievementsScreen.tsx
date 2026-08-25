import React, { useCallback, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useAge } from '../context/AgeContext';
import { getUnlockedLevel, GameId } from '../data/progress';
import { LEVELS_PER_AGE } from '../data/difficulty';
import { colors, fonts } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Achievements'>;

const SUBJECTS: { game: GameId; label: string; color: string; icon: string }[] = [
  { game: 'Math', label: 'Riyaziyyat', color: colors.math, icon: '🔢' },
  { game: 'English', label: 'İngilis dili', color: colors.english, icon: '🗣️' },
  { game: 'Alphabet', label: 'Əlifba', color: colors.alphabet, icon: '🔤' },
];

export default function AchievementsScreen({}: Props) {
  const { age } = useAge();
  const [completedByGame, setCompletedByGame] = useState<Record<GameId, number>>({ Math: 0, English: 0, Alphabet: 0 });

  useFocusEffect(
    useCallback(() => {
      let active = true;
      Promise.all(SUBJECTS.map((s) => getUnlockedLevel(s.game, age))).then((levels) => {
        if (!active) return;
        const next: Record<GameId, number> = { Math: 0, English: 0, Alphabet: 0 };
        SUBJECTS.forEach((s, i) => {
          next[s.game] = Math.max(0, levels[i] - 1);
        });
        setCompletedByGame(next);
      });
      return () => {
        active = false;
      };
    }, [age])
  );

  const totalCompleted = SUBJECTS.reduce((sum, s) => sum + completedByGame[s.game], 0);
  const totalPossible = SUBJECTS.length * LEVELS_PER_AGE;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>🏆 {age} yaş üzrə nailiyyətlərin</Text>
      <Text style={styles.subheading}>
        Ümumi: {totalCompleted}/{totalPossible} səviyyə tamamlandı
      </Text>

      <View style={styles.list}>
        {SUBJECTS.map((s) => {
          const completed = completedByGame[s.game];
          const ratio = LEVELS_PER_AGE > 0 ? completed / LEVELS_PER_AGE : 0;
          return (
            <View key={s.game} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.cardIcon}>{s.icon}</Text>
                <Text style={styles.cardLabel}>{s.label}</Text>
                <Text style={styles.cardCount}>
                  {completed}/{LEVELS_PER_AGE}
                </Text>
              </View>
              <View style={styles.track}>
                <View style={[styles.fill, { width: `${ratio * 100}%`, backgroundColor: s.color }]} />
              </View>
              {completed >= LEVELS_PER_AGE && <Text style={styles.badge}>🏅 Bütün səviyyələr bitdi!</Text>}
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 24,
  },
  heading: {
    fontSize: 22,
    fontFamily: fonts.display,
    color: colors.text,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  subheading: {
    fontSize: 14,
    fontFamily: fonts.button,
    color: colors.text,
    opacity: 0.65,
    marginTop: 6,
    marginBottom: 20,
  },
  list: {
    width: '100%',
    paddingHorizontal: 20,
    gap: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardIcon: { fontSize: 22, marginRight: 8 },
  cardLabel: { flex: 1, fontFamily: fonts.buttonBold, fontSize: 16, color: colors.text },
  cardCount: { fontFamily: fonts.buttonBold, fontSize: 14, color: colors.text, opacity: 0.6 },
  track: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#EDE9F8',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 5,
  },
  badge: {
    marginTop: 8,
    fontFamily: fonts.buttonBold,
    fontSize: 13,
    color: colors.correct,
  },
});
