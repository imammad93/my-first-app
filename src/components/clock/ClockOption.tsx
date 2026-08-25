import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ClockFace from './ClockFace';

type Status = 'default' | 'correct' | 'wrong';

type Props = {
  hour: number;
  status: Status;
  disabled: boolean;
  onPress: () => void;
};

const cardGradient: Record<Status, readonly [string, string]> = {
  default: ['#FFFFFF', '#EDEAF6'],
  correct: ['#6FCF87', '#3FA663'],
  wrong: ['#F5928A', '#DE5A50'],
};

export default function ClockOption({ hour, status, disabled, onPress }: Props) {
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (status !== 'wrong') return;
    Animated.sequence([
      Animated.timing(shake, { toValue: 1, duration: 55, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 55, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 1, duration: 55, easing: Easing.linear, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 55, easing: Easing.linear, useNativeDriver: true }),
    ]).start();
  }, [status, shake]);

  const shakeX = shake.interpolate({ inputRange: [-1, 1], outputRange: [-8, 8] });

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Saat ${hour}`}
      style={({ pressed }) => [styles.shadowWrap, pressed && styles.pressed]}
    >
      <LinearGradient colors={cardGradient[status]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={styles.card}>
        <View style={styles.sheen} />
        <Animated.View style={{ transform: [{ translateX: shakeX }] }}>
          <ClockFace hour={hour} size={78} />
        </Animated.View>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    margin: 8,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOpacity: 0.28,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 9 },
    elevation: 8,
  },
  card: {
    borderRadius: 22,
    padding: 10,
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(0,0,0,0.16)',
    overflow: 'hidden',
  },
  sheen: {
    position: 'absolute',
    top: 4,
    left: '14%',
    right: '14%',
    height: '28%',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  pressed: {
    transform: [{ scale: 0.96 }],
    shadowOpacity: 0.14,
  },
});
