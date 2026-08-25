import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts } from '../../theme';

type Props = {
  name: string;
  hex: string;
  wrong: boolean;
  disabled: boolean;
  onPress: () => void;
};

export default function PaintDrop({ name, hex, wrong, disabled, onPress }: Props) {
  const shake = useRef(new Animated.Value(0)).current;
  const bob = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bob, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [bob]);

  useEffect(() => {
    if (!wrong) return;
    Animated.sequence([
      Animated.timing(shake, { toValue: 1, duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 1, duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 55, useNativeDriver: true }),
    ]).start();
  }, [wrong, shake]);

  const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -5] });
  const shakeX = shake.interpolate({ inputRange: [-1, 1], outputRange: [-7, 7] });

  return (
    <Pressable disabled={disabled} onPress={onPress} style={styles.wrap} accessibilityRole="button" accessibilityLabel={name}>
      <Animated.View style={[styles.dropShadow, { transform: [{ translateY }, { translateX: shakeX }] }]}>
        <Svg width={70} height={80} viewBox="0 0 70 80">
          <Path
            d="M35 4 C50 26 62 42 62 54 C62 69 50 78 35 78 C20 78 8 69 8 54 C8 42 20 26 35 4 Z"
            fill={hex}
            stroke="#FFFFFF"
            strokeWidth={2.5}
          />
          <Path d="M22 40 C22 34 27 30 32 30" stroke="#FFFFFF" strokeWidth={3} strokeLinecap="round" opacity={0.55} fill="none" />
        </Svg>
      </Animated.View>
      <View style={styles.puddle} />
      <Text style={styles.label}>{name}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 92,
    margin: 6,
    alignItems: 'center',
  },
  dropShadow: {
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  puddle: {
    width: 46,
    height: 12,
    marginTop: -6,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.12)',
  },
  label: {
    marginTop: 4,
    fontFamily: fonts.buttonBold,
    fontSize: 14,
    color: colors.text,
  },
});
