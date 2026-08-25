import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet } from 'react-native';
import ClockFace from './ClockFace';
import { colors } from '../../theme';

type Status = 'default' | 'correct' | 'wrong';

type Props = {
  hour: number;
  status: Status;
  disabled: boolean;
  onPress: () => void;
};

const cardColor: Record<Status, string> = {
  default: colors.optionDefault,
  correct: colors.correct,
  wrong: colors.wrong,
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
      style={({ pressed }) => [styles.card, { backgroundColor: cardColor[status] }, pressed && styles.pressed]}
    >
      <Animated.View style={{ transform: [{ translateX: shakeX }] }}>
        <ClockFace hour={hour} size={78} />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 22,
    padding: 10,
    margin: 8,
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(0,0,0,0.14)',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
});
