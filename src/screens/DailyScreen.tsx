import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import AnimatedCreature from '../components/AnimatedCreature';
import { colors, fonts } from '../theme';
import type { GameId } from '../data/progress';

type Props = NativeStackScreenProps<RootStackParamList, 'Daily'>;

const ROTATION: { game: GameId; label: string; color: string; emoji: string }[] = [
  { game: 'Math', label: 'Riyaziyyat', color: colors.math, emoji: '🔢' },
  { game: 'English', label: 'İngilis dili', color: colors.english, emoji: '🗣️' },
  { game: 'Alphabet', label: 'Əlifba', color: colors.alphabet, emoji: '🔤' },
];

export default function DailyScreen({ navigation }: Props) {
  const dayIndex = new Date().getDay() % ROTATION.length;
  const today = ROTATION[dayIndex];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.eyebrow}>Bugünkü tövsiyə</Text>
      <AnimatedCreature emoji={today.emoji} motion="idle" size={72} />
      <Text style={styles.title}>{today.label}</Text>
      <Text style={styles.subtitle}>Bu gün bir az {today.label.toLowerCase()} məşq edək!</Text>
      <Pressable
        style={[styles.button, { backgroundColor: today.color }]}
        accessibilityRole="button"
        accessibilityLabel="Başla"
        onPress={() => navigation.navigate('LevelSelect', { game: today.game })}
      >
        <Text style={styles.buttonLabel}>Başla ▶</Text>
      </Pressable>
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
    gap: 6,
  },
  eyebrow: {
    fontSize: 13,
    fontFamily: fonts.buttonBold,
    color: colors.text,
    opacity: 0.55,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.display,
    color: colors.text,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.button,
    color: colors.text,
    opacity: 0.65,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    minWidth: 180,
    minHeight: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.15)',
  },
  buttonLabel: {
    color: colors.white,
    fontSize: 17,
    fontFamily: fonts.buttonBold,
  },
});
