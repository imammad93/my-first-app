import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Wagon, { WAGON_HEIGHT, WAGON_WIDTH } from './Wagon';
import AnimatedCreature from '../AnimatedCreature';
import { MotionType } from '../../data/motion';

const CREATURE_SIZE = 56;
const CREATURE_LEFT = 4;
const TRAVEL_DURATION = 420;

type Props = {
  emoji: string;
  motion: MotionType;
  options: string[];
  correctWord: string;
  wrongPicks: string[];
  solved: boolean;
  disabled: boolean;
  onPick: (word: string) => void;
};

export default function WordTrainGame({ emoji, motion, options, correctWord, wrongPicks, solved, disabled, onPick }: Props) {
  const [rowWidth, setRowWidth] = useState(0);
  const travel = useRef(new Animated.Value(0)).current;
  const enter = useRef(new Animated.Value(0)).current;
  const [entering, setEntering] = useState(false);

  const onRowLayout = (e: LayoutChangeEvent) => {
    setRowWidth(e.nativeEvent.layout.width);
  };

  // Wagons are laid out with justifyContent: 'space-between' at a fixed WAGON_WIDTH each,
  // so the gap (and each wagon's center) has to be derived from that, not an even slot width.
  const correctIndex = Math.max(0, options.indexOf(correctWord));
  const n = options.length;
  const gap = n > 1 ? (rowWidth - n * WAGON_WIDTH) / (n - 1) : 0;
  const targetCenter = n > 1 ? correctIndex * (WAGON_WIDTH + gap) + WAGON_WIDTH / 2 : rowWidth / 2;
  // The creature box left-aligns at CREATURE_LEFT with no stretch, so its own center is
  // CREATURE_LEFT + half its size — travel distance is target center minus that start center.
  const startCenter = CREATURE_LEFT + CREATURE_SIZE / 2;
  const distance = targetCenter - startCenter;

  useEffect(() => {
    if (!solved || rowWidth === 0) return;
    travel.setValue(0);
    enter.setValue(0);
    setEntering(false);

    Animated.timing(travel, {
      toValue: 1,
      duration: TRAVEL_DURATION,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;
      setEntering(true);
      Animated.timing(enter, { toValue: 1, duration: 240, easing: Easing.in(Easing.quad), useNativeDriver: true }).start();
    });
  }, [solved, rowWidth, travel, enter]);

  const translateX = travel.interpolate({ inputRange: [0, 1], outputRange: [0, distance] });
  const bob = travel.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -14, 0] });
  const scale = enter.interpolate({ inputRange: [0, 1], outputRange: [1, 0.15] });
  const opacity = enter.interpolate({ inputRange: [0, 1], outputRange: [1, 0] });

  return (
    <View style={styles.stage}>
      <View style={styles.track}>
        <Animated.View
          style={[
            styles.creature,
            {
              opacity: solved ? opacity : 1,
              transform: [{ translateX: solved ? translateX : 0 }, { translateY: bob }, { scale: solved ? scale : 1 }],
            },
          ]}
        >
          <AnimatedCreature emoji={emoji} motion={solved ? 'idle' : motion} size={CREATURE_SIZE} />
        </Animated.View>
      </View>

      <View style={styles.rail} />

      <View style={styles.wagonRow} onLayout={onRowLayout}>
        {options.map((word, i) => (
          <Wagon
            key={word}
            word={word}
            index={i}
            disabled={disabled}
            wrong={wrongPicks.includes(word)}
            open={solved && word === correctWord && entering}
            onPress={() => onPick(word)}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    width: '100%',
    paddingHorizontal: 12,
    marginVertical: 8,
  },
  track: {
    height: CREATURE_SIZE + 8,
    justifyContent: 'flex-end',
  },
  creature: {
    alignSelf: 'flex-start',
    marginLeft: CREATURE_LEFT,
  },
  rail: {
    height: 4,
    backgroundColor: '#D8CFE8',
    borderRadius: 2,
    marginBottom: 8,
  },
  wagonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: WAGON_HEIGHT + 34,
  },
});
