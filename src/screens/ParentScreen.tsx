import React, { useCallback, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useAge } from '../context/AgeContext';
import { getUnlockedLevel, GameId } from '../data/progress';
import { LEVELS_PER_AGE } from '../data/difficulty';
import { colors, fonts } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Parent'>;

const SUBJECTS: { game: GameId; label: string }[] = [
  { game: 'Math', label: 'Riyaziyyat' },
  { game: 'English', label: 'İngilis dili' },
  { game: 'Alphabet', label: 'Əlifba' },
];

export default function ParentScreen({ navigation }: Props) {
  const { age } = useAge();
  const [rows, setRows] = useState<{ label: string; completed: number }[]>([]);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      Promise.all(SUBJECTS.map((s) => getUnlockedLevel(s.game, age))).then((levels) => {
        if (!active) return;
        setRows(SUBJECTS.map((s, i) => ({ label: s.label, completed: Math.max(0, levels[i] - 1) })));
      });
      return () => {
        active = false;
      };
    }, [age])
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Valideyn Paneli</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Uşağın yaşı</Text>
        <View style={styles.ageRow}>
          <Text style={styles.ageValue}>{age} yaş</Text>
          <Pressable
            style={styles.changeBtn}
            accessibilityRole="button"
            accessibilityLabel="Dəyiş"
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.changeBtnLabel}>Dəyiş</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Tərəqqi ({age} yaş üzrə)</Text>
        {rows.map((r) => (
          <View key={r.label} style={styles.progressRow}>
            <Text style={styles.progressLabel}>{r.label}</Text>
            <Text style={styles.progressValue}>
              {r.completed}/{LEVELS_PER_AGE}
            </Text>
          </View>
        ))}
      </View>

      <Text style={styles.note}>
        Tətbiq reklamsızdır və internet bağlantısı tələb etmir. Səviyyələr yaşa görə avtomatik
        çətinləşir.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'stretch',
    paddingTop: 24,
    paddingHorizontal: 20,
    gap: 16,
  },
  heading: {
    fontSize: 22,
    fontFamily: fonts.display,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
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
  cardLabel: {
    fontFamily: fonts.buttonBold,
    fontSize: 14,
    color: colors.text,
    opacity: 0.6,
    marginBottom: 8,
  },
  ageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ageValue: { fontFamily: fonts.display, fontSize: 22, color: colors.text },
  changeBtn: {
    backgroundColor: colors.home,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  changeBtnLabel: { color: colors.white, fontFamily: fonts.buttonBold, fontSize: 13 },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  progressLabel: { fontFamily: fonts.button, fontSize: 14, color: colors.text },
  progressValue: { fontFamily: fonts.buttonBold, fontSize: 14, color: colors.text, opacity: 0.7 },
  note: {
    fontSize: 12.5,
    fontFamily: fonts.button,
    color: colors.text,
    opacity: 0.55,
    textAlign: 'center',
    marginTop: 4,
  },
});
