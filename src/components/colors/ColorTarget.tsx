import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Props = {
  hex: string | null;
  splash: boolean;
};

/** An outlined circle that fills with color (and pops a little) once the round is solved. */
export default function ColorTarget({ hex, splash }: Props) {
  const fill = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!splash) {
      fill.setValue(0);
      scale.setValue(1);
      return;
    }
    Animated.timing(fill, { toValue: 1, duration: 280, easing: Easing.out(Easing.quad), useNativeDriver: false }).start();
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.15, duration: 180, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 200, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
  }, [splash, fill, scale]);

  const fillOpacity = fill.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Svg width={96} height={96} viewBox="0 0 96 96">
        <Circle cx={48} cy={48} r={40} fill="#FFFFFF" stroke="#D8CFE8" strokeWidth={3} />
        <AnimatedCircle cx={48} cy={48} r={40} fill={hex ?? '#FFFFFF'} opacity={fillOpacity} />
      </Svg>
    </Animated.View>
  );
}
