import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

type Props = {
  visible: boolean;
  onDone: () => void;
};

export default function CelebrationOverlay({ visible, onDone }: Props) {
  const scale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    scale.setValue(0);
    Animated.sequence([
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, friction: 4 }),
      Animated.delay(700),
      Animated.timing(scale, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(onDone);
  }, [visible, scale, onDone]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.overlay, { transform: [{ scale }] }]} pointerEvents="none">
      <Text style={styles.text}>🎉 Əla! 🎉</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: '40%',
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 32,
    elevation: 8,
  },
  text: {
    fontSize: 32,
    fontWeight: '800',
  },
});
