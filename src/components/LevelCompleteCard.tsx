import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';
import { LEVELS_PER_AGE } from '../data/difficulty';

type Props = {
  level: number;
  stars: number;
  color: string;
  onNextLevel: () => void;
  onBackToLevels: () => void;
};

export default function LevelCompleteCard({ level, stars, color, onNextLevel, onBackToLevels }: Props) {
  const hasNextLevel = level < LEVELS_PER_AGE;

  return (
    <View style={styles.overlay}>
      <View style={styles.card}>
        <Text style={styles.title}>Səviyyə {level} tamamlandı!</Text>
        <Text style={styles.stars}>{'⭐'.repeat(stars)}{'☆'.repeat(3 - stars)}</Text>
        {hasNextLevel ? (
          <Pressable style={[styles.button, { backgroundColor: color }]} onPress={onNextLevel}>
            <Text style={styles.buttonLabel}>Növbəti səviyyə ▶</Text>
          </Pressable>
        ) : (
          <Text style={styles.doneText}>Bütün səviyyələri bitirdin! 🏆</Text>
        )}
        <Pressable style={styles.secondaryButton} onPress={onBackToLevels}>
          <Text style={styles.secondaryLabel}>Səviyyələrə qayıt</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '82%',
    backgroundColor: colors.white,
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  stars: {
    fontSize: 36,
    marginBottom: 20,
  },
  doneText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 28,
    marginBottom: 12,
  },
  buttonLabel: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: 8,
  },
  secondaryLabel: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
