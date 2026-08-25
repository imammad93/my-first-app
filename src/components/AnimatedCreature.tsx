import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text } from 'react-native';
import { Image } from 'expo-image';
import { MotionType } from '../data/motion';
import { ANIMAL_ASSETS } from '../data/animalAssets';

type Props = {
  emoji: string;
  motion: MotionType;
  size?: number;
};

export default function AnimatedCreature({ emoji, motion, size = 96 }: Props) {
  const realAsset = ANIMAL_ASSETS[emoji];
  if (realAsset) {
    return <Image source={realAsset} style={{ width: size * 1.8, height: size * 1.8 }} contentFit="contain" />;
  }

  switch (motion) {
    case 'walk':
      return <Walker emoji={emoji} size={size} range={55} stepMs={2000} />;
    case 'swim':
      return <Walker emoji={emoji} size={size} range={38} stepMs={1400} wiggle />;
    case 'fly':
      return <Flyer emoji={emoji} size={size} />;
    case 'hop':
      return <Hopper emoji={emoji} size={size} />;
    default:
      return <Idle emoji={emoji} size={size} />;
  }
}

/** Walks back and forth, flipping to face its direction of travel. Also used (narrower + wiggle) for swimming. */
function Walker({
  emoji,
  size,
  range,
  stepMs,
  wiggle,
}: {
  emoji: string;
  size: number;
  range: number;
  stepMs: number;
  wiggle?: boolean;
}) {
  const posX = useRef(new Animated.Value(0)).current;
  const bob = useRef(new Animated.Value(0)).current;
  const [facingRight, setFacingRight] = useState(true);
  const goingRight = useRef(true);

  useEffect(() => {
    let cancelled = false;

    const step = () => {
      if (cancelled) return;
      Animated.timing(posX, {
        toValue: goingRight.current ? 1 : 0,
        duration: stepMs,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished || cancelled) return;
        goingRight.current = !goingRight.current;
        setFacingRight(goingRight.current);
        step();
      });
    };
    step();

    Animated.loop(
      Animated.sequence([
        Animated.timing(bob, {
          toValue: 1,
          duration: wiggle ? 220 : 260,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(bob, {
          toValue: 0,
          duration: wiggle ? 220 : 260,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      cancelled = true;
    };
  }, [posX, bob, stepMs, wiggle]);

  const translateX = posX.interpolate({ inputRange: [0, 1], outputRange: [-range, range] });
  const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, wiggle ? 3 : -6] });
  const rotate = wiggle
    ? bob.interpolate({ inputRange: [0, 1], outputRange: ['-4deg', '4deg'] })
    : '0deg';

  return (
    <Animated.View style={{ transform: [{ translateX }, { scaleX: facingRight ? 1 : -1 }] }}>
      <Animated.Text
        style={[styles.emoji, { fontSize: size, transform: [{ translateY }, { rotate }] }]}
      >
        {emoji}
      </Animated.Text>
    </Animated.View>
  );
}

/** Swoops across in a sine-like path with a banking tilt, like a bird or plane in flight. */
function Flyer({ emoji, size }: { emoji: string; size: number }) {
  const posX = useRef(new Animated.Value(0)).current;
  const posY = useRef(new Animated.Value(0)).current;
  const [facingRight, setFacingRight] = useState(true);
  const goingRight = useRef(true);

  useEffect(() => {
    let cancelled = false;

    const stepX = () => {
      if (cancelled) return;
      Animated.timing(posX, {
        toValue: goingRight.current ? 1 : 0,
        duration: 1900,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished || cancelled) return;
        goingRight.current = !goingRight.current;
        setFacingRight(goingRight.current);
        stepX();
      });
    };
    stepX();

    Animated.loop(
      Animated.sequence([
        Animated.timing(posY, { toValue: 1, duration: 950, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(posY, { toValue: 0, duration: 950, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    ).start();

    return () => {
      cancelled = true;
    };
  }, [posX, posY]);

  const translateX = posX.interpolate({ inputRange: [0, 1], outputRange: [-70, 70] });
  const translateY = posY.interpolate({ inputRange: [0, 1], outputRange: [-18, 18] });
  const rotate = posY.interpolate({ inputRange: [0, 1], outputRange: ['-10deg', '10deg'] });

  return (
    <Animated.View style={{ transform: [{ translateX }, { translateY }, { scaleX: facingRight ? 1 : -1 }] }}>
      <Animated.Text style={[styles.emoji, { fontSize: size, transform: [{ rotate }] }]}>{emoji}</Animated.Text>
    </Animated.View>
  );
}

/** Bounces in place with a squash-and-stretch, like a rabbit, frog, or bouncing ball. */
function Hopper({ emoji, size }: { emoji: string; size: number }) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(t, { toValue: 1, duration: 420, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(t, { toValue: 0, duration: 420, easing: Easing.in(Easing.quad), useNativeDriver: true }),
        Animated.delay(260),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [t]);

  const translateY = t.interpolate({ inputRange: [0, 1], outputRange: [0, -34] });
  const scaleY = t.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0.85, 1.15, 1] });
  const scaleX = t.interpolate({ inputRange: [0, 0.15, 1], outputRange: [1.15, 0.9, 1] });

  return (
    <Animated.Text
      style={[styles.emoji, { fontSize: size, transform: [{ translateY }, { scaleY }, { scaleX }] }]}
    >
      {emoji}
    </Animated.Text>
  );
}

/** Gentle idle breathing/pulse for non-creature items (fruit, objects, letters). */
function Idle({ emoji, size }: { emoji: string; size: number }) {
  const t = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(t, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(t, { toValue: 0, duration: 900, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [t]);

  const scale = t.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] });
  const rotate = t.interpolate({ inputRange: [0, 1], outputRange: ['-3deg', '3deg'] });

  return (
    <Animated.Text style={[styles.emoji, { fontSize: size, transform: [{ scale }, { rotate }] }]}>
      {emoji}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  emoji: {
    textAlign: 'center',
  },
});
