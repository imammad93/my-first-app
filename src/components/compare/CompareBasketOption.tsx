import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import Basket from '../math/Basket';
import { colors, fonts } from '../../theme';

type Status = 'default' | 'correct' | 'wrong';

type Props = {
  count: number;
  emoji: string;
  status: Status;
  disabled: boolean;
  side: 'left' | 'right';
  onPress: () => void;
};

const cardColor: Record<Status, string> = {
  default: colors.optionDefault,
  correct: colors.correct,
  wrong: colors.wrong,
};

export default function CompareBasketOption({ count, emoji, status, disabled, side, onPress }: Props) {
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
      accessibilityLabel={`${side === 'left' ? 'Sol' : 'Sağ'} səbət, ${count}`}
      style={({ pressed }) => [styles.card, { backgroundColor: cardColor[status] }, pressed && styles.pressed]}
    >
      <Animated.View style={{ transform: [{ translateX: shakeX }] }}>
        <View style={styles.fruitZone}>
          <View style={styles.grid}>
            {Array.from({ length: count }, (_, i) => (
              <Text key={i} style={styles.fruit}>
                {emoji}
              </Text>
            ))}
          </View>
        </View>
        <Basket width={110} height={82} />
        <Text style={[styles.count, status !== 'default' && styles.countOnColor]}>{count}</Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 10,
    margin: 10,
    alignItems: 'center',
    minWidth: 140,
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(0,0,0,0.14)',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  fruitZone: {
    minHeight: 44,
    justifyContent: 'flex-end',
    marginBottom: -4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: 96,
  },
  fruit: {
    fontSize: 18,
    width: 22,
    textAlign: 'center',
  },
  count: {
    marginTop: 4,
    fontSize: 20,
    fontFamily: fonts.buttonBold,
    color: colors.text,
  },
  countOnColor: {
    color: colors.white,
  },
});
