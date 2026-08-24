import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import {
  CONFIG,
  Country,
  VB_HEIGHT,
  VB_WIDTH,
  VB_X,
  VB_Y,
  computeBboxes,
  flagFromIso2,
  regionColorMap,
} from './mapData';
import { useMapTransform } from './useMapTransform';

const QUESTIONS_PER_ROUND = 10;

const learnable = CONFIG.countries.filter((c) => c.path && c.capital);

function pickTarget(excludeId?: string): Country {
  let country = learnable[Math.floor(Math.random() * learnable.length)];
  let guard = 0;
  while (country.id === excludeId && guard < 20) {
    country = learnable[Math.floor(Math.random() * learnable.length)];
    guard++;
  }
  return country;
}

type PromptStyle = 'byName' | 'byCapital';

function pickPromptStyle(): PromptStyle {
  return Math.random() < 0.5 ? 'byName' : 'byCapital';
}

export default function WorldMapQuiz() {
  const { theme, animation } = CONFIG;
  const colorByRegion = useMemo(() => regionColorMap(CONFIG.countries, theme.countryPalette), [theme.countryPalette]);
  const bboxes = useMemo(() => computeBboxes(CONFIG.countries), []);

  const [target, setTarget] = useState<Country>(() => pickTarget());
  const [promptStyle, setPromptStyle] = useState<PromptStyle>(() => pickPromptStyle());
  const [questionIndex, setQuestionIndex] = useState(1);
  const [score, setScore] = useState(0);
  const [solved, setSolved] = useState(false);
  const [wrongId, setWrongId] = useState<string | null>(null);
  const [roundOver, setRoundOver] = useState(false);

  const { scale, translateX, translateY, fitToBbox, resetView, panHandlers, onFrameLayout } = useMapTransform();

  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(animation.infoCard.initialScale)).current;

  const showSuccessCard = useCallback(() => {
    cardOpacity.setValue(0);
    cardScale.setValue(animation.infoCard.initialScale);
    Animated.timing(cardOpacity, { toValue: 1, duration: animation.infoCard.durationMs, useNativeDriver: true }).start();
    Animated.sequence([
      Animated.timing(cardScale, {
        toValue: animation.infoCard.overshootScale,
        duration: animation.infoCard.durationMs * 0.6,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, { toValue: 1, duration: animation.infoCard.durationMs * 0.4, useNativeDriver: true }),
    ]).start();
  }, [animation.infoCard, cardOpacity, cardScale]);

  const onCountryPress = (country: Country) => {
    if (solved || roundOver) return;
    if (country.id === target.id) {
      setSolved(true);
      setScore((s) => s + 1);
      const bb = bboxes[country.id];
      if (bb) fitToBbox(bb, animation.countryZoomDurationMs);
      showSuccessCard();
    } else {
      setWrongId(country.id);
      setTimeout(() => setWrongId(null), 400);
    }
  };

  const nextQuestion = () => {
    if (questionIndex >= QUESTIONS_PER_ROUND) {
      setRoundOver(true);
      return;
    }
    Animated.timing(cardOpacity, { toValue: 0, duration: 150, useNativeDriver: true }).start();
    resetView(420);
    setQuestionIndex((i) => i + 1);
    setTarget((prev) => pickTarget(prev.id));
    setPromptStyle(pickPromptStyle());
    setSolved(false);
  };

  const playAgain = () => {
    setScore(0);
    setQuestionIndex(1);
    setRoundOver(false);
    setSolved(false);
    setTarget(pickTarget());
    setPromptStyle(pickPromptStyle());
    resetView(1);
  };

  const promptText =
    promptStyle === 'byName'
      ? `${target.nameAz} ölkəsini tap!`
      : `Paytaxtı ${target.capital} olan ölkəni tap!`;

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.ocean }]}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Xəritə Oyunu</Text>
          <View style={styles.scoreBadge}>
            <Text style={styles.scoreText}>⭐ {score}</Text>
          </View>
        </View>
        <Text style={styles.progress}>Sual {Math.min(questionIndex, QUESTIONS_PER_ROUND)}/{QUESTIONS_PER_ROUND}</Text>
        {!roundOver && <Text style={styles.prompt}>{promptText}</Text>}
      </View>

      <View style={[styles.mapFrame, { backgroundColor: theme.ocean }]} onLayout={onFrameLayout} {...panHandlers}>
        <Animated.View style={{ width: '100%', height: '100%', transform: [{ translateX }, { translateY }, { scale }] }}>
          <Svg width="100%" height="100%" viewBox={`${VB_X} ${VB_Y} ${VB_WIDTH} ${VB_HEIGHT}`}>
            {CONFIG.countries
              .filter((c) => !c.markerOnly && c.path)
              .map((c) => {
                const isTargetSolved = solved && c.id === target.id;
                const isWrong = wrongId === c.id;
                return (
                  <Path
                    key={c.id}
                    d={c.path}
                    fill={isTargetSolved ? animation.selectedCountry.fill : isWrong ? '#E8756B' : colorByRegion[c.region]}
                    stroke={isTargetSolved || isWrong ? '#FFFFFF' : '#FFFFFF'}
                    strokeWidth={isTargetSolved ? 1.6 : 0.6}
                    fillRule="evenodd"
                    onPress={() => onCountryPress(c)}
                  />
                );
              })}

            {CONFIG.countries
              .filter((c) => c.markerOnly)
              .map((c) => {
                const [cx, cy] = c.center;
                const isTargetSolved = solved && c.id === target.id;
                const isWrong = wrongId === c.id;
                return (
                  <Circle
                    key={`marker-${c.id}`}
                    cx={cx}
                    cy={cy}
                    r={isTargetSolved ? 6.5 : 4.5}
                    fill={isTargetSolved ? animation.selectedCountry.fill : isWrong ? '#E8756B' : colorByRegion[c.region]}
                    stroke="#FFFFFF"
                    strokeWidth={1}
                    onPress={() => onCountryPress(c)}
                  />
                );
              })}
          </Svg>
        </Animated.View>
      </View>

      {solved && !roundOver ? (
        <Animated.View
          style={[styles.infoCard, { backgroundColor: theme.cardBackground, opacity: cardOpacity, transform: [{ scale: cardScale }] }]}
        >
          <Text style={[styles.selectedMessage, { color: theme.primaryText }]}>🎉 Doğru tapdın!</Text>
          <Text style={styles.countryFlag}>{flagFromIso2(target.iso2)}</Text>
          <Text style={[styles.countryName, { color: theme.primaryText }]}>{target.nameAz}</Text>
          <Text style={styles.capitalLabel}>Paytaxt</Text>
          <Text style={[styles.capitalName, { color: theme.capitalText }]}>{target.capital}</Text>
          <Pressable onPress={nextQuestion} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>
              {questionIndex >= QUESTIONS_PER_ROUND ? 'Nəticəyə bax' : 'Növbəti sual →'}
            </Text>
          </Pressable>
        </Animated.View>
      ) : null}

      {roundOver ? (
        <View style={[styles.infoCard, { backgroundColor: theme.cardBackground }]}>
          <Text style={[styles.selectedMessage, { color: theme.primaryText }]}>Tur bitdi!</Text>
          <Text style={styles.countryFlag}>🏆</Text>
          <Text style={[styles.countryName, { color: theme.primaryText }]}>{score}/{QUESTIONS_PER_ROUND} doğru</Text>
          <Pressable onPress={playAgain} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Yenidən oyna</Text>
          </Pressable>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  header: { marginBottom: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: '900' },
  scoreBadge: { backgroundColor: 'rgba(255,255,255,0.92)', borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  scoreText: { fontWeight: '800', color: '#094B9B', fontSize: 14 },
  progress: { marginTop: 4, color: '#EAFBFF', fontSize: 12, fontWeight: '700' },
  prompt: { marginTop: 6, color: '#FFFFFF', fontSize: 17, fontWeight: '800' },
  mapFrame: { width: '100%', aspectRatio: 2, borderRadius: 24, overflow: 'hidden', borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)' },
  infoCard: { marginTop: 14, marginBottom: 16, borderRadius: 24, padding: 20, alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 8 }, shadowRadius: 16 },
  selectedMessage: { fontSize: 15, fontWeight: '800', marginBottom: 6 },
  countryFlag: { fontSize: 36, marginBottom: 4 },
  countryName: { fontSize: 22, fontWeight: '900', textAlign: 'center' },
  capitalLabel: { marginTop: 8, fontSize: 12, fontWeight: '700', color: '#7D93A8' },
  capitalName: { fontSize: 20, fontWeight: '900', marginTop: 2 },
  closeButton: { marginTop: 16, minWidth: 160, minHeight: 46, borderRadius: 14, backgroundColor: '#094B9B', alignItems: 'center', justifyContent: 'center' },
  closeButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
});
