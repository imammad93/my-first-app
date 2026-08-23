import React, { useCallback, useState } from 'react';
import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useAge } from '../context/AgeContext';
import { getUnlockedLevel } from '../data/progress';
import { LEVELS_PER_AGE } from '../data/difficulty';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'LevelSelect'>;

const gameColor: Record<string, string> = {
  Math: colors.math,
  English: colors.english,
  Alphabet: colors.alphabet,
};

const gameTitle: Record<string, string> = {
  Math: 'Riyaziyyat',
  English: 'İngilis dili',
  Alphabet: 'Əlifba',
};

export default function LevelSelectScreen({ navigation, route }: Props) {
  const { game } = route.params;
  const { age } = useAge();
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const color = gameColor[game];

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getUnlockedLevel(game, age).then((level) => {
        if (active) setUnlockedLevel(level);
      });
      return () => {
        active = false;
      };
    }, [game, age])
  );

  const levels = Array.from({ length: LEVELS_PER_AGE }, (_, i) => i + 1);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.subtitle}>
        {gameTitle[game]} · {age} yaş
      </Text>
      <FlatList
        data={levels}
        numColumns={5}
        keyExtractor={(level) => String(level)}
        contentContainerStyle={styles.grid}
        renderItem={({ item: level }) => {
          const locked = level > unlockedLevel;
          return (
            <Pressable
              disabled={locked}
              onPress={() => (navigation.navigate as (screen: string, params: { level: number }) => void)(game, { level })}
              style={[
                styles.cell,
                { backgroundColor: locked ? '#E2DEF0' : color },
              ]}
            >
              <Text style={[styles.cellLabel, locked && styles.cellLabelLocked]}>
                {locked ? '🔒' : level}
              </Text>
            </Pressable>
          );
        }}
      />
      <View style={styles.legend}>
        <Text style={styles.legendText}>Hər səviyyədə 20 sual var. Növbəti səviyyəni açmaq üçün əvvəlkini bitir.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  grid: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  cell: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 6,
  },
  cellLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.white,
  },
  cellLabelLocked: {
    color: '#9A93B8',
    fontSize: 16,
  },
  legend: {
    paddingHorizontal: 32,
    paddingBottom: 16,
  },
  legendText: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
});
