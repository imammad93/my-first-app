import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

type Props = {
  title: string;
  score: number;
  total: number;
  color: string;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
};

export default function MiniCompleteCard({ title, score, total, color, onPlayAgain, onBackToMenu }: Props) {
  const cardScale = useRef(new Animated.Value(0.6)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(cardScale, { toValue: 1, friction: 6, tension: 80, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
    ]).start();
  }, [cardScale, cardOpacity]);

  const ratio = total > 0 ? score / total : 0;
  const emoji = ratio >= 0.9 ? '🏆' : ratio >= 0.6 ? '🎉' : '💪';

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.card, { opacity: cardOpacity, transform: [{ scale: cardScale }] }]}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text style={styles.title}>{title} bitdi!</Text>
        <Text style={styles.score}>
          {score}/{total} doğru
        </Text>
        <Pressable
          style={[styles.button, { backgroundColor: color }]}
          onPress={onPlayAgain}
          accessibilityRole="button"
          accessibilityLabel="Yenidən oyna"
        >
          <Text style={styles.buttonLabel}>Yenidən oyna ▶</Text>
        </Pressable>
        <Pressable
          style={styles.secondaryButton}
          onPress={onBackToMenu}
          accessibilityRole="button"
          accessibilityLabel="Menyuya qayıt"
        >
          <Text style={styles.secondaryLabel}>Menyuya qayıt</Text>
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
    backgroundColor: 'rgba(46,42,74,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 28,
    paddingVertical: 28,
    paddingHorizontal: 32,
    alignItems: 'center',
    width: '82%',
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
  },
  emoji: { fontSize: 48, marginBottom: 4 },
  title: {
    fontSize: 22,
    fontFamily: fonts.display,
    color: colors.text,
    marginBottom: 6,
    textAlign: 'center',
  },
  score: {
    fontSize: 17,
    fontFamily: fonts.buttonBold,
    color: colors.text,
    opacity: 0.75,
    marginBottom: 20,
  },
  button: {
    minWidth: 200,
    minHeight: 50,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.15)',
  },
  buttonLabel: { color: colors.white, fontSize: 16, fontFamily: fonts.buttonBold },
  secondaryButton: { paddingVertical: 8 },
  secondaryLabel: { color: colors.text, opacity: 0.6, fontSize: 14, fontFamily: fonts.button },
});
