import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { colors, fonts } from '../../theme';

const LEAF_COLORS = ['#4CAF7A', '#6FBF73', '#3FA66A', '#57B888', '#4AA36B'];
const SPARKLES = ['✨', '⭐', '✨', '⭐'];

type Status = 'default' | 'correct' | 'wrong';

type Props = {
  label: string;
  icon?: React.ReactNode;
  status: Status;
  disabled: boolean;
  index: number;
  useSmallFont?: boolean;
  onPress: () => void;
};

export default function LeafOption({ label, icon, status, disabled, index, useSmallFont, onPress }: Props) {
  const sway = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;
  const fly = useRef(new Animated.Value(0)).current;
  const color = LEAF_COLORS[index % LEAF_COLORS.length];

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(index * 180),
        Animated.timing(sway, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(sway, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [sway, index]);

  useEffect(() => {
    if (status !== 'wrong') return;
    Animated.sequence([
      Animated.timing(shake, { toValue: 1, duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 1, duration: 55, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 55, useNativeDriver: true }),
    ]).start();
  }, [status, shake]);

  useEffect(() => {
    if (status !== 'correct') {
      fly.setValue(0);
      return;
    }
    Animated.timing(fly, { toValue: 1, duration: 480, easing: Easing.out(Easing.cubic), useNativeDriver: true }).start();
  }, [status, fly]);

  const rotate = sway.interpolate({ inputRange: [0, 1], outputRange: ['-4deg', '4deg'] });
  const shakeX = shake.interpolate({ inputRange: [-1, 1], outputRange: [-7, 7] });
  const flyY = fly.interpolate({ inputRange: [0, 1], outputRange: [0, -60] });
  const flyScale = fly.interpolate({ inputRange: [0, 0.3, 1], outputRange: [1, 1.15, 0.5] });
  const flyOpacity = fly.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] });

  return (
    <Pressable disabled={disabled} onPress={onPress} style={styles.wrap} accessibilityRole="button" accessibilityLabel={label}>
      <Animated.View
        style={{
          transform: [
            { rotate: status === 'default' ? rotate : '0deg' },
            { translateX: shakeX },
            { translateY: flyY },
            { scale: flyScale },
          ],
          opacity: flyOpacity,
        }}
      >
        <Svg width={92} height={104} viewBox="0 0 92 104">
          <Path
            d="M46 4 C78 14 88 46 68 76 C58 92 46 100 46 100 C46 100 34 92 24 76 C4 46 14 14 46 4 Z"
            fill={status === 'wrong' ? '#E8756B' : color}
            stroke="#FFFFFF"
            strokeWidth={2}
          />
          <Path d="M46 14 L46 92" stroke="#FFFFFF" strokeWidth={2} opacity={0.5} />
        </Svg>
        <View style={styles.content} pointerEvents="none">
          {icon}
          <Text style={[styles.label, useSmallFont && styles.labelSmall]} numberOfLines={1}>
            {label}
          </Text>
        </View>

        {status === 'correct' &&
          SPARKLES.map((s, i) => (
            <Animated.Text
              key={i}
              style={[
                styles.sparkle,
                {
                  left: 16 + i * 16,
                  top: 20 - (i % 2) * 20,
                  opacity: flyOpacity,
                  transform: [{ translateY: flyY }, { scale: flyScale }],
                },
              ]}
            >
              {s}
            </Animated.Text>
          ))}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: 92,
    height: 104,
    margin: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 22,
    fontFamily: fonts.buttonBold,
    color: colors.white,
    marginTop: 2,
  },
  labelSmall: { fontSize: 13 },
  sparkle: {
    position: 'absolute',
    fontSize: 16,
  },
});
