import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';
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
  const cardScale = useRef(new Animated.Value(0.6)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(cardScale, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [cardScale, cardOpacity]);

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.card, { opacity: cardOpacity, transform: [{ scale: cardScale }] }]}>
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
      </Animated.View>
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
    borderRadius: 28,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.display,
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
    fontFamily: fonts.buttonBold,
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 28,
    marginBottom: 12,
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.15)',
  },
  buttonLabel: {
    color: colors.white,
    fontSize: 17,
    fontFamily: fonts.button,
  },
  secondaryButton: {
    paddingVertical: 8,
  },
  secondaryLabel: {
    color: colors.text,
    fontSize: 15,
    fontFamily: fonts.buttonBold,
    textDecorationLine: 'underline',
  },
});
