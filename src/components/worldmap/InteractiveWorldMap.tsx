import React, { useMemo, useRef, useState } from 'react';
import { Animated, Easing, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { CONFIG, Country, VB_HEIGHT, VB_WIDTH, VB_X, VB_Y, computeBboxes, flagFromIso2, regionColorMap } from './mapData';
import { useMapTransform } from './useMapTransform';
import { fonts } from '../../theme';

export default function InteractiveWorldMap() {
  const { labels, animation, theme } = CONFIG;
  const countries = useMemo(() => CONFIG.countries, []);
  const bboxes = useMemo(() => computeBboxes(countries), [countries]);
  const colorByRegion = useMemo(() => regionColorMap(countries, theme.countryPalette), [countries, theme.countryPalette]);

  const [selected, setSelected] = useState<Country | null>(null);
  const { scale, translateX, translateY, zoomed, fitToBbox, resetView, zoomByStep, panHandlers, onFrameLayout } =
    useMapTransform();

  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(animation.infoCard.initialScale)).current;
  const glowPulse = useRef(new Animated.Value(0)).current;

  const openCountry = (country: Country) => {
    setSelected(country);
    const bb = bboxes[country.id];
    if (bb) fitToBbox(bb, animation.countryZoomDurationMs);

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

    glowPulse.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 1, duration: 700, useNativeDriver: false }),
        Animated.timing(glowPulse, { toValue: 0, duration: 700, useNativeDriver: false }),
      ])
    ).start();
  };

  const closeCard = () => {
    Animated.timing(cardOpacity, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => setSelected(null));
  };

  const onViewMap = () => {
    closeCard();
    resetView(CONFIG.interaction.reset.resetDurationMs);
  };

  const glowOpacity = glowPulse.interpolate({ inputRange: [0, 1], outputRange: [0.35, 0.9] });

  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: theme.ocean }]}>
      <View style={styles.header}>
        <Text style={styles.title}>{labels.title}</Text>
        <Text style={styles.subtitle}>{labels.subtitle}</Text>
      </View>

      <View style={[styles.mapFrame, { backgroundColor: theme.ocean }]} onLayout={onFrameLayout} {...panHandlers}>
        <Animated.View style={{ width: '100%', height: '100%', transform: [{ translateX }, { translateY }, { scale }] }}>
          <Svg width="100%" height="100%" viewBox={`${VB_X} ${VB_Y} ${VB_WIDTH} ${VB_HEIGHT}`}>
            {countries
              .filter((c) => !c.markerOnly && c.path)
              .map((c) => {
                const isSelected = selected?.id === c.id;
                return (
                  <Path
                    key={c.id}
                    d={c.path}
                    fill={isSelected ? animation.selectedCountry.fill : colorByRegion[c.region]}
                    stroke={isSelected ? animation.selectedCountry.stroke : '#FFFFFF'}
                    strokeWidth={isSelected ? 1.6 : 0.6}
                    fillRule="evenodd"
                    onPress={() => openCountry(c)}
                  />
                );
              })}

            {countries
              .filter((c) => c.markerOnly)
              .map((c) => {
                const isSelected = selected?.id === c.id;
                const [cx, cy] = c.center;
                return (
                  <Circle
                    key={`marker-${c.id}`}
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 6.5 : 4.5}
                    fill={isSelected ? animation.selectedCountry.fill : colorByRegion[c.region]}
                    stroke="#FFFFFF"
                    strokeWidth={1}
                    onPress={() => openCountry(c)}
                  />
                );
              })}

            {selected?.capitalPoint ? (
              <Circle cx={selected.capitalPoint[0]} cy={selected.capitalPoint[1]} r={3.2} fill="#FFFFFF" stroke="#094B9B" strokeWidth={1} />
            ) : null}
          </Svg>
        </Animated.View>

        {selected ? <Animated.View pointerEvents="none" style={[styles.glowRing, { opacity: glowOpacity }]} /> : null}

        <View style={styles.zoomControls}>
          <Pressable style={styles.zoomBtn} onPress={() => zoomByStep(1)} accessibilityLabel={labels.zoomIn}>
            <Text style={styles.zoomBtnText}>+</Text>
          </Pressable>
          <Pressable style={styles.zoomBtn} onPress={() => zoomByStep(-1)} accessibilityLabel={labels.zoomOut}>
            <Text style={styles.zoomBtnText}>−</Text>
          </Pressable>
        </View>

        {zoomed ? (
          <Pressable style={styles.resetBtn} onPress={onViewMap}>
            <Text style={styles.resetBtnText}>🌍 {labels.viewMapButton}</Text>
          </Pressable>
        ) : (
          <View style={styles.hintPill}>
            <Text style={styles.hintText}>{labels.tapHint}</Text>
          </View>
        )}
      </View>

      {selected ? (
        <Animated.View
          style={[styles.infoCard, { backgroundColor: theme.cardBackground, opacity: cardOpacity, transform: [{ scale: cardScale }] }]}
        >
          <Text style={[styles.selectedMessage, { color: theme.primaryText }]}>{labels.selectedMessage}</Text>
          <Text style={styles.countryFlag}>{flagFromIso2(selected.iso2)}</Text>
          <Text style={[styles.countryName, { color: theme.primaryText }]}>{selected.nameAz}</Text>
          <Text style={styles.countryEnglish}>{selected.nameEn}</Text>
          <View style={styles.divider} />
          <Text style={styles.capitalLabel}>{labels.capitalLabel}</Text>
          <Text style={[styles.capitalName, { color: theme.capitalText }]}>{selected.capital}</Text>
          <Pressable onPress={closeCard} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Bağla</Text>
          </Pressable>
        </Animated.View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  header: { marginBottom: 14 },
  title: { color: '#FFFFFF', fontSize: 26, fontFamily: fonts.display },
  subtitle: { marginTop: 4, color: '#EAFBFF', fontSize: 14, fontFamily: fonts.button },
  mapFrame: { width: '100%', aspectRatio: 2, borderRadius: 24, overflow: 'hidden', borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)' },
  glowRing: { position: 'absolute', top: 8, left: 8, right: 8, bottom: 8, borderRadius: 18, borderWidth: 3, borderColor: '#FFE34F' },
  zoomControls: { position: 'absolute', top: 12, right: 12, gap: 8 },
  zoomBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.92)', alignItems: 'center', justifyContent: 'center', elevation: 4 },
  zoomBtnText: { fontSize: 22, fontFamily: fonts.buttonBold, color: '#094B9B' },
  resetBtn: { position: 'absolute', bottom: 14, alignSelf: 'center', backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 18, paddingHorizontal: 16, paddingVertical: 10, elevation: 4 },
  resetBtnText: { fontSize: 14, fontFamily: fonts.buttonBold, color: '#094B9B' },
  hintPill: { position: 'absolute', bottom: 14, alignSelf: 'center', backgroundColor: 'rgba(9,75,155,0.85)', borderRadius: 18, paddingHorizontal: 16, paddingVertical: 10 },
  hintText: { color: '#FFFFFF', fontSize: 13, fontFamily: fonts.button },
  infoCard: { marginTop: 14, marginBottom: 16, borderRadius: 24, padding: 20, alignItems: 'center', elevation: 8, shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: 0, height: 8 }, shadowRadius: 16 },
  selectedMessage: { fontSize: 13, fontFamily: fonts.buttonBold, marginBottom: 6 },
  countryFlag: { fontSize: 40, marginBottom: 4 },
  countryName: { fontSize: 26, fontFamily: fonts.display, textAlign: 'center' },
  countryEnglish: { fontSize: 13, color: '#7D93A8', marginTop: 2, fontFamily: fonts.button },
  divider: { width: '60%', height: 1, backgroundColor: 'rgba(9,75,155,0.15)', marginVertical: 14 },
  capitalLabel: { fontSize: 12, fontFamily: fonts.buttonBold, color: '#7D93A8' },
  capitalName: { fontSize: 24, fontFamily: fonts.display, marginTop: 2 },
  closeButton: { marginTop: 16, minWidth: 140, minHeight: 44, borderRadius: 14, backgroundColor: '#094B9B', alignItems: 'center', justifyContent: 'center' },
  closeButtonText: { color: '#FFFFFF', fontSize: 14, fontFamily: fonts.buttonBold },
});
