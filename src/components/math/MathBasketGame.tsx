import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';
import Basket from './Basket';
import { colors, fonts } from '../../theme';

const FRUITS = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍌'];
const BASKET_WIDTH = 128;
const GAP = 48;
const FLY_DURATION = 360;
// useLevelRound advances to the next question 900ms after a correct pick, so the whole
// flight (staggered start + duration) must finish comfortably before that, however many
// fruit are flying.
const MAX_TOTAL_FLIGHT = 780;

function staggerFor(count: number): number {
  if (count <= 1) return 0;
  return Math.max(0, Math.min(60, Math.floor((MAX_TOTAL_FLIGHT - FLY_DURATION) / (count - 1))));
}

function totalFlightTime(count: number): number {
  if (count <= 0) return 0;
  return (count - 1) * staggerFor(count) + FLY_DURATION;
}

type Props = {
  a: number;
  b: number;
  op: '+' | '-';
  solved: boolean;
};

function fruitFor(op: '+' | '-', side: 'left' | 'right', index: number): string {
  const base = op === '+' ? (side === 'left' ? 0 : 3) : 0;
  return FRUITS[(base + index) % FRUITS.length];
}

/** Grid of fruit emoji, wrapping into rows, sized to fit inside a basket's mouth. */
function FruitGrid({
  items,
  highlightFrom,
}: {
  items: string[];
  highlightFrom?: number;
}) {
  return (
    <View style={styles.grid}>
      {items.map((fruit, i) => (
        <Text key={i} style={[styles.fruit, highlightFrom !== undefined && i >= highlightFrom && styles.fruitHighlight]}>
          {fruit}
        </Text>
      ))}
    </View>
  );
}

/** One fruit that flies from its start basket to the merged pile when the sum is confirmed. */
function FlyingFruit({ fruit, delay, dx, onDone }: { fruit: string; delay: number; dx: number; onDone?: () => void }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(progress, { toValue: 1, duration: FLY_DURATION, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start(({ finished }) => {
      if (finished) onDone?.();
    });
  }, [progress, delay, onDone]);

  const translateX = progress.interpolate({ inputRange: [0, 1], outputRange: [0, dx] });
  const translateY = progress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -46, 0] });
  const scale = progress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [1, 1.15, 0.92] });

  return (
    <Animated.Text style={[styles.fruit, styles.flyingFruit, { transform: [{ translateX }, { translateY }, { scale }] }]}>
      {fruit}
    </Animated.Text>
  );
}

/** One fruit that flies up and away out of the basket when it's subtracted. */
function LeavingFruit({ fruit, delay }: { fruit: string; delay: number }) {
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.timing(progress, { toValue: 1, duration: FLY_DURATION, easing: Easing.out(Easing.quad), useNativeDriver: true }),
    ]).start();
  }, [progress, delay]);

  const translateY = progress.interpolate({ inputRange: [0, 1], outputRange: [0, -120] });
  const rotate = progress.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '25deg'] });
  const opacity = progress.interpolate({ inputRange: [0, 0.7, 1], outputRange: [1, 1, 0] });

  return (
    <Animated.Text style={[styles.fruit, styles.flyingFruit, { opacity, transform: [{ translateY }, { rotate }] }]}>
      {fruit}
    </Animated.Text>
  );
}

export default function MathBasketGame({ a, b, op, solved }: Props) {
  const leftItems = useMemo(() => Array.from({ length: a }, (_, i) => fruitFor(op, 'left', i)), [a, op]);
  const rightItems = useMemo(() => Array.from({ length: b }, (_, i) => fruitFor(op, 'right', i)), [b, op]);
  const [merged, setMerged] = useState(false);
  const mergeScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (op !== '+' || !solved) return;
    const totalDelay = totalFlightTime(b);
    const t = setTimeout(() => {
      setMerged(true);
      mergeScale.setValue(0.85);
      Animated.spring(mergeScale, { toValue: 1, friction: 5, tension: 90, useNativeDriver: true }).start();
    }, totalDelay);
    return () => clearTimeout(t);
  }, [op, solved, b, mergeScale]);

  if (op === '+') {
    const mergedItems = [...leftItems, ...rightItems];
    return (
      <View style={styles.row}>
        <View style={styles.basketSlot}>
          <View style={styles.fruitZone}>
            {merged ? (
              <Animated.View style={{ transform: [{ scale: mergeScale }] }}>
                <FruitGrid items={mergedItems} />
              </Animated.View>
            ) : (
              <FruitGrid items={leftItems} />
            )}
          </View>
          <Basket />
          <Text style={styles.countBadge}>{merged ? a + b : a}</Text>
        </View>

        <Text style={styles.opSymbol}>+</Text>

        {!merged && (
          <View style={[styles.basketSlot, { opacity: solved ? 0.35 : 1 }]}>
            <View style={styles.fruitZone}>
              {solved
                ? rightItems.map((fruit, i) => (
                    <FlyingFruit key={i} fruit={fruit} delay={i * staggerFor(b)} dx={-(BASKET_WIDTH + GAP)} />
                  ))
                : <FruitGrid items={rightItems} />}
            </View>
            <Basket />
            <Text style={styles.countBadge}>{b}</Text>
          </View>
        )}
      </View>
    );
  }

  // Subtraction: one basket, the last `b` fruit fly away when solved.
  const keepCount = Math.max(0, a - b);
  const staying = leftItems.slice(0, keepCount);
  const leaving = leftItems.slice(keepCount);

  return (
    <View style={styles.row}>
      <View style={styles.basketSlot}>
        <View style={styles.fruitZone}>
          <FruitGrid items={staying} />
          {solved
            ? leaving.map((fruit, i) => <LeavingFruit key={i} fruit={fruit} delay={i * staggerFor(leaving.length)} />)
            : leaving.map((fruit, i) => (
                <Text key={i} style={[styles.fruit, styles.fruitHighlight]}>
                  {fruit}
                </Text>
              ))}
        </View>
        <Basket />
        <Text style={styles.countBadge}>{solved ? keepCount : a}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: GAP,
    marginVertical: 8,
    minHeight: 150,
  },
  basketSlot: {
    alignItems: 'center',
    width: BASKET_WIDTH,
  },
  fruitZone: {
    minHeight: 56,
    justifyContent: 'flex-end',
    marginBottom: -6,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: BASKET_WIDTH - 6,
  },
  fruit: {
    fontSize: 22,
    width: 28,
    textAlign: 'center',
  },
  fruitHighlight: {
    opacity: 0.55,
  },
  flyingFruit: {
    position: 'absolute',
    bottom: 4,
  },
  opSymbol: {
    fontSize: 36,
    fontFamily: fonts.display,
    color: colors.math,
    marginBottom: 30,
  },
  countBadge: {
    marginTop: 6,
    fontSize: 18,
    fontFamily: fonts.buttonBold,
    color: colors.text,
    backgroundColor: colors.white,
    minWidth: 32,
    textAlign: 'center',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
    overflow: 'hidden',
  },
});
