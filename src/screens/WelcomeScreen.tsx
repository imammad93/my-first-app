import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Defs, LinearGradient, Path, Rect, Stop, Text as SvgText } from 'react-native-svg';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import AnimatedCreature from '../components/AnimatedCreature';
import { fonts } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const AnimatedSvgText = Animated.createAnimatedComponent(SvgText);

/** Static sky gradient + sun + distant village skyline, drawn once. */
function SkyBackdrop() {
  return (
    <Svg width="100%" height="100%" viewBox="0 0 400 800" style={styles.absoluteFill} preserveAspectRatio="xMidYMid slice">
      <Defs>
        <LinearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#7DD8F0" />
          <Stop offset="0.55" stopColor="#57B9E8" />
          <Stop offset="1" stopColor="#3E96D8" />
        </LinearGradient>
        <LinearGradient id="sun" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFE58A" />
          <Stop offset="1" stopColor="#FFC145" />
        </LinearGradient>
      </Defs>
      <Rect x="0" y="0" width="400" height="800" fill="url(#sky)" />
      <Path d="M330 90 m-46 0 a46 46 0 1 0 92 0 a46 46 0 1 0 -92 0" fill="url(#sun)" opacity={0.95} />
      <Path
        d="M0 620 L30 600 L55 615 L90 585 L120 610 L150 590 L185 615 L215 592 L250 618 L280 595 L320 620 L360 598 L400 622 L400 800 L0 800 Z"
        fill="#2E7FB8"
        opacity={0.55}
      />
      <Path
        d="M0 660 L40 645 L70 665 L110 635 L145 662 L190 640 L230 668 L270 642 L310 666 L350 645 L400 668 L400 800 L0 800 Z"
        fill="#2569A0"
        opacity={0.7}
      />
    </Svg>
  );
}

function Cloud({ left, top, scale, driftMs }: { left: number; top: number; scale: number; driftMs: number }) {
  const drift = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(drift, { toValue: 1, duration: driftMs, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(drift, { toValue: 0, duration: driftMs, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [drift, driftMs]);

  const translateX = drift.interpolate({ inputRange: [0, 1], outputRange: [0, 22] });

  return (
    <Animated.View style={[styles.cloud, { left, top, transform: [{ scale }, { translateX }] }]}>
      <View style={styles.cloudPuffBig} />
      <View style={styles.cloudPuffSmall} />
    </Animated.View>
  );
}

function Balloon({ left, top, color, stripe, bobMs, delay }: { left: number; top: number; color: string; stripe: string; bobMs: number; delay: number }) {
  const bob = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(bob, { toValue: 1, duration: bobMs, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(bob, { toValue: 0, duration: bobMs, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [bob, bobMs, delay]);

  const translateY = bob.interpolate({ inputRange: [0, 1], outputRange: [0, -16] });
  const rotate = bob.interpolate({ inputRange: [0, 1], outputRange: ['-3deg', '3deg'] });

  return (
    <Animated.View style={[styles.balloonWrap, { left, top, transform: [{ translateY }, { rotate }] }]}>
      <Svg width={54} height={78} viewBox="0 0 54 78">
        <Path d="M27 2 C10 2 2 22 2 34 C2 50 14 62 27 62 C40 62 52 50 52 34 C52 22 44 2 27 2 Z" fill={color} />
        <Path d="M27 2 C19 10 16 24 16 34 C16 48 20 58 27 62 C34 58 38 48 38 34 C38 24 35 10 27 2 Z" fill={stripe} opacity={0.55} />
        <Path d="M20 62 L16 70 L38 70 L34 62 Z" fill="#8A5A32" />
        <Rect x="20" y="70" width="14" height="8" rx="2" fill="#B4783E" />
      </Svg>
    </Animated.View>
  );
}

/** The bubble-style title: a soft drop-shadow layer behind a gradient-filled SVG text. */
function BubbleTitle() {
  const pulse = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0, duration: 1400, easing: Easing.inOut(Easing.sin), useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  const scale = pulse.interpolate({ inputRange: [0, 1], outputRange: [1, 1.03] });

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Svg width={320} height={92} viewBox="0 0 320 92">
        <Defs>
          <LinearGradient id="titleFill" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFE9A8" />
            <Stop offset="0.5" stopColor="#FFC145" />
            <Stop offset="1" stopColor="#FF9F3D" />
          </LinearGradient>
        </Defs>
        <SvgText
          x="160"
          y="46"
          fontSize="34"
          fontFamily={fonts.display}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={10}
          strokeLinejoin="round"
          textAnchor="middle"
        >
          Öyrən və
        </SvgText>
        <SvgText x="160" y="46" fontSize="34" fontFamily={fonts.display} fill="url(#titleFill)" textAnchor="middle">
          Öyrən və
        </SvgText>
        <SvgText
          x="160"
          y="84"
          fontSize="34"
          fontFamily={fonts.display}
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={10}
          strokeLinejoin="round"
          textAnchor="middle"
        >
          Oyna!
        </SvgText>
        <SvgText x="160" y="84" fontSize="34" fontFamily={fonts.display} fill="url(#titleFill)" textAnchor="middle">
          Oyna!
        </SvgText>
      </Svg>
    </Animated.View>
  );
}

export default function WelcomeScreen({ navigation }: Props) {
  const startScale = useRef(new Animated.Value(1)).current;

  return (
    <View style={styles.root}>
      <SkyBackdrop />
      <Cloud left={20} top={70} scale={0.9} driftMs={5200} />
      <Cloud left={230} top={130} scale={1.15} driftMs={6400} />
      <Cloud left={110} top={40} scale={0.7} driftMs={4600} />
      <Balloon left={26} top={190} color="#FF6B8B" stripe="#FFFFFF" bobMs={2600} delay={0} />
      <Balloon left={300} top={230} color="#4CAF7A" stripe="#FFF3C4" bobMs={3100} delay={400} />
      <Balloon left={250} top={110} color="#8B7CF6" stripe="#FFD9F0" bobMs={2900} delay={800} />

      <SafeAreaView style={styles.safe}>
        <View style={styles.topRow}>
          <View style={styles.iconPill}>
            <Text style={styles.iconPillText}>⚙️</Text>
          </View>
          <View style={styles.iconPill}>
            <Text style={styles.iconPillText}>⭐ 0</Text>
          </View>
        </View>

        <View style={styles.center}>
          <BubbleTitle />
          <Text style={styles.tagline}>Öyrən, kəşf et, əylən!</Text>

          <View style={styles.mascotRow}>
            <View style={styles.mascotGround} />
            <View style={styles.dogWrap}>
              <AnimatedCreature emoji="🐶" motion="walk" size={46} sound />
            </View>
            <AnimatedCreature emoji="🧒" motion="hop" size={84} />
          </View>
        </View>

        <Pressable
          onPressIn={() => Animated.spring(startScale, { toValue: 0.94, useNativeDriver: true }).start()}
          onPressOut={() => Animated.spring(startScale, { toValue: 1, friction: 4, useNativeDriver: true }).start()}
          onPress={() => navigation.replace('HomeMenu')}
        >
          <Animated.View style={[styles.startButton, { transform: [{ scale: startScale }] }]}>
            <Text style={styles.startButtonText}>BAŞLA ▶</Text>
          </Animated.View>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  absoluteFill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  root: { flex: 1, backgroundColor: '#57B9E8' },
  cloud: { position: 'absolute' },
  cloudPuffBig: {
    width: 64,
    height: 34,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  cloudPuffSmall: {
    position: 'absolute',
    top: -14,
    left: 16,
    width: 40,
    height: 28,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  balloonWrap: { position: 'absolute' },
  safe: { flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 18 },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  iconPill: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    elevation: 3,
  },
  iconPillText: {
    fontFamily: fonts.buttonBold,
    fontSize: 15,
    color: '#2E2A4A',
  },
  center: { alignItems: 'center', flex: 1, justifyContent: 'center' },
  tagline: {
    marginTop: 6,
    fontFamily: fonts.buttonBold,
    fontSize: 16,
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
  },
  mascotRow: {
    marginTop: 28,
    height: 120,
    width: 220,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  mascotGround: {
    position: 'absolute',
    bottom: 0,
    width: 200,
    height: 26,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dogWrap: { marginRight: -6, marginBottom: 4 },
  startButton: {
    backgroundColor: '#FF9F3D',
    borderBottomWidth: 6,
    borderBottomColor: '#D97A1F',
    borderRadius: 28,
    paddingHorizontal: 52,
    paddingVertical: 16,
    elevation: 6,
    marginBottom: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontFamily: fonts.display,
    fontSize: 22,
    letterSpacing: 1,
  },
});
