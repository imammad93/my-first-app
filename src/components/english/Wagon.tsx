import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { colors, fonts } from '../../theme';

export const WAGON_WIDTH = 108;
export const WAGON_HEIGHT = 78;
const VB_W = 140;
const VB_H = 100;
const SCALE_X = WAGON_WIDTH / VB_W;
const SCALE_Y = WAGON_HEIGHT / VB_H;
const DOOR_W = 36 * SCALE_X;
const DOOR_H = 46 * SCALE_Y;
const DOOR_LEFT = 52 * SCALE_X;
const DOOR_TOP = 34 * SCALE_Y;

const WAGON_COLORS = ['#E8756B', '#4CAF7A', '#5AA9E6', '#F0A93E', '#B389F0'];

type Props = {
  word: string;
  index: number;
  disabled: boolean;
  wrong: boolean;
  open: boolean;
  onPress: () => void;
};

export default function Wagon({ word, index, disabled, wrong, open, onPress }: Props) {
  const color = WAGON_COLORS[index % WAGON_COLORS.length];
  const doorX = useRef(new Animated.Value(0)).current;
  const shake = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (open) {
      Animated.timing(doorX, {
        toValue: 1,
        duration: 260,
        delay: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    } else {
      doorX.setValue(0);
    }
  }, [open, doorX]);

  useEffect(() => {
    if (!wrong) return;
    Animated.sequence([
      Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: -1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 1, duration: 60, useNativeDriver: true }),
      Animated.timing(shake, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start();
  }, [wrong, shake]);

  const doorTranslate = doorX.interpolate({ inputRange: [0, 1], outputRange: [0, DOOR_W + 8] });
  const shakeTranslate = shake.interpolate({ inputRange: [-1, 1], outputRange: [-6, 6] });

  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={word}
      style={styles.wrap}
    >
      <Animated.View style={{ transform: [{ translateX: shakeTranslate }] }}>
        <Svg width={WAGON_WIDTH} height={WAGON_HEIGHT} viewBox={`0 0 ${VB_W} ${VB_H}`}>
          <Rect x={16} y={8} width={108} height={16} rx={8} fill={color} opacity={0.85} />
          <Rect x={6} y={20} width={128} height={60} rx={10} fill={color} stroke="#00000022" strokeWidth={1.5} />
          <Rect x={52} y={34} width={36} height={46} rx={4} fill="#3B2F2F" />
          <Circle cx={34} cy={86} r={10} fill={colors.text} stroke="#FFFFFF" strokeWidth={1.5} />
          <Circle cx={106} cy={86} r={10} fill={colors.text} stroke="#FFFFFF" strokeWidth={1.5} />
        </Svg>

        <Animated.View
          style={[
            styles.door,
            {
              backgroundColor: wrong ? '#FF8A80' : color,
              left: DOOR_LEFT,
              top: DOOR_TOP,
              width: DOOR_W,
              height: DOOR_H,
              transform: [{ translateX: doorTranslate }],
            },
          ]}
        />
      </Animated.View>
      <View style={[styles.label, wrong && styles.labelWrong]}>
        <Text style={styles.labelText} numberOfLines={1}>
          {word}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    width: WAGON_WIDTH,
  },
  door: {
    position: 'absolute',
    borderRadius: 4,
  },
  label: {
    marginTop: 6,
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    minWidth: WAGON_WIDTH - 10,
    alignItems: 'center',
  },
  labelWrong: {
    backgroundColor: '#FFE1DE',
  },
  labelText: {
    fontFamily: fonts.buttonBold,
    fontSize: 15,
    color: colors.text,
  },
});
