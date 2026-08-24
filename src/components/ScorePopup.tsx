import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text } from 'react-native';

const CONFETTI = ['#FFC145', '#4CAF7A', '#8B7CF6', '#FF6B8B', '#3AAED8'];

export default function ScorePopup({ points = 10 }: { points?: number }) {
  const rise = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const bits = useRef(CONFETTI.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.timing(rise, { toValue: 1, duration: 750, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      ]),
    ]).start();
    Animated.timing(opacity, { toValue: 0, duration: 200, delay: 500, useNativeDriver: true }).start();

    bits.forEach((b) => {
      Animated.timing(b, { toValue: 1, duration: 600, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
    });
  }, [bits, opacity, rise]);

  const translateY = rise.interpolate({ inputRange: [0, 1], outputRange: [0, -46] });

  return (
    <>
      <Animated.View style={[styles.badge, { opacity, transform: [{ translateY }] }]} pointerEvents="none">
        <Text style={styles.text}>+{points} ⭐</Text>
      </Animated.View>
      {bits.map((b, i) => {
        const angle = (Math.PI * 2 * i) / bits.length;
        const dx = Math.cos(angle) * 34;
        const dy = Math.sin(angle) * 34;
        return (
          <Animated.View
            key={i}
            pointerEvents="none"
            style={[
              styles.dot,
              {
                backgroundColor: CONFETTI[i % CONFETTI.length],
                opacity: b.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] }),
                transform: [
                  { translateX: b.interpolate({ inputRange: [0, 1], outputRange: [0, dx] }) },
                  { translateY: b.interpolate({ inputRange: [0, 1], outputRange: [0, dy] }) },
                  { scale: b.interpolate({ inputRange: [0, 1], outputRange: [1, 0.4] }) },
                ],
              },
            ]}
          />
        );
      })}
    </>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -18,
    alignSelf: 'center',
    zIndex: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFC145',
    textShadowColor: 'rgba(0,0,0,0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  dot: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: -4,
    marginLeft: -4,
    zIndex: 9,
  },
});
