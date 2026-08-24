import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Stop,
} from 'react-native-svg';

const WORLD = require('./world-map-interactive.json') as WorldMapData;

type Country = {
  id: string;
  iso2?: string | null;
  nameAz: string;
  nameEn: string;
  capital: string;
  region: string;
  center: [number, number];
  capitalPoint?: [number, number] | null;
  markerOnly: boolean;
  path: string;
};

type WorldMapData = {
  meta: {
    viewBox: [number, number, number, number];
    projection: string;
    countryCount: number;
    polygonCountries: number;
    markerOnlyCountries: number;
  };
  countries: Country[];
};

const VB_WIDTH = 1200;
const VB_HEIGHT = 600;

function flagFromIso2(iso2?: string | null): string {
  if (!iso2 || iso2.length !== 2) return '🏳️';
  const codePoints = [...iso2.toUpperCase()].map((c) => 0x1f1e6 + (c.charCodeAt(0) - 65));
  return String.fromCodePoint(...codePoints);
}

export default function InteractiveWorldMap() {
  const [selected, setSelected] = useState<Country | null>(null);
  const cardOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.82)).current;
  const cardTranslate = useRef(new Animated.Value(18)).current;

  const countries = useMemo(() => WORLD.countries, []);

  const openCountry = (country: Country) => {
    setSelected(country);
    cardOpacity.setValue(0);
    cardScale.setValue(0.82);
    cardTranslate.setValue(18);

    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        friction: 7,
        tension: 90,
        useNativeDriver: true,
      }),
      Animated.timing(cardTranslate, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeCountry = () => {
    Animated.parallel([
      Animated.timing(cardOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 0.9,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => setSelected(null));
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>KIDS EXPLORER</Text>
        <Text style={styles.title}>Dünya xəritəsi</Text>
        <Text style={styles.subtitle}>
          Ölkəyə toxun — adı və paytaxtı ortaya çıxsın.
        </Text>
      </View>

      <View style={styles.mapCard}>
        <View style={styles.glowA} />
        <View style={styles.glowB} />

        <View style={styles.mapFrame}>
          <Svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
          >
            <Defs>
              <LinearGradient id="countryGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="#79E9FF" stopOpacity="1" />
                <Stop offset="0.52" stopColor="#24AEEB" stopOpacity="1" />
                <Stop offset="1" stopColor="#0A6BB5" stopOpacity="1" />
              </LinearGradient>
              <LinearGradient id="selectedGradient" x1="0" y1="0" x2="1" y2="1">
                <Stop offset="0" stopColor="#E8FDFF" stopOpacity="1" />
                <Stop offset="0.45" stopColor="#86F2FF" stopOpacity="1" />
                <Stop offset="1" stopColor="#25C8FF" stopOpacity="1" />
              </LinearGradient>
            </Defs>

            {/* Dark offset layer = simple 3D/extruded depth */}
            {countries
              .filter((country) => !country.markerOnly && country.path)
              .map((country) => (
                <Path
                  key={`shadow-${country.id}`}
                  d={country.path}
                  fill="#073B67"
                  stroke="#052743"
                  strokeWidth={1.15}
                  fillRule="evenodd"
                  transform="translate(0 6)"
                  opacity={0.82}
                />
              ))}

            {/* Main interactive country shapes */}
            {countries
              .filter((country) => !country.markerOnly && country.path)
              .map((country) => {
                const isSelected = selected?.id === country.id;
                return (
                  <Path
                    key={country.id}
                    d={country.path}
                    fill={isSelected ? 'url(#selectedGradient)' : 'url(#countryGradient)'}
                    stroke={isSelected ? '#FFFFFF' : '#C9F4FF'}
                    strokeWidth={isSelected ? 2.2 : 0.9}
                    fillRule="evenodd"
                    onPress={() => openCountry(country)}
                  />
                );
              })}

            {/* Countries too small for low-res polygons are still tappable as markers */}
            {countries
              .filter((country) => country.markerOnly)
              .map((country) => {
                const isSelected = selected?.id === country.id;
                const [cx, cy] = country.center;
                return (
                  <Circle
                    key={`marker-${country.id}`}
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 7.5 : 5.2}
                    fill={isSelected ? '#E9FEFF' : '#61DBFF'}
                    stroke="#FFFFFF"
                    strokeWidth={isSelected ? 2.2 : 1.1}
                    onPress={() => openCountry(country)}
                  />
                );
              })}

            {/* Capital marker for selected country */}
            {selected?.capitalPoint ? (
              <>
                <Circle
                  cx={selected.capitalPoint[0]}
                  cy={selected.capitalPoint[1]}
                  r={8}
                  fill="#FFFFFF"
                  opacity={0.25}
                />
                <Circle
                  cx={selected.capitalPoint[0]}
                  cy={selected.capitalPoint[1]}
                  r={3.8}
                  fill="#FFFFFF"
                />
              </>
            ) : null}
          </Svg>
        </View>

        <View style={styles.hintPill}>
          <View style={styles.hintDot} />
          <Text style={styles.hintText}>
            {selected
              ? `${flagFromIso2(selected.iso2)} ${selected.nameAz} • ${selected.capital}`
              : 'Ölkəyə toxun'}
          </Text>
        </View>
      </View>

      {selected ? (
        <View style={styles.overlay} pointerEvents="box-none">
          <Pressable style={styles.backdrop} onPress={closeCountry} />

          <Animated.View
            style={[
              styles.infoCard,
              {
                opacity: cardOpacity,
                transform: [
                  { scale: cardScale },
                  { translateY: cardTranslate },
                ],
              },
            ]}
          >
            <View style={styles.infoGlow} />
            <Text style={styles.infoEyebrow}>{flagFromIso2(selected.iso2)} ÖLKƏ</Text>
            <Text style={styles.countryName}>{selected.nameAz}</Text>
            <Text style={styles.countryEnglish}>{selected.nameEn}</Text>

            <View style={styles.divider} />

            <Text style={styles.capitalLabel}>Paytaxt</Text>
            <Text style={styles.capitalName}>{selected.capital}</Text>

            <Pressable
              onPress={closeCountry}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && styles.closeButtonPressed,
              ]}
            >
              <Text style={styles.closeButtonText}>Bağla</Text>
            </Pressable>
          </Animated.View>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#03101F',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    marginBottom: 14,
  },
  eyebrow: {
    color: '#5CDAFF',
    fontSize: 11,
    letterSpacing: 2.2,
    fontWeight: '800',
  },
  title: {
    marginTop: 5,
    color: '#F3FCFF',
    fontSize: 30,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 5,
    color: '#A9C8D9',
    fontSize: 14,
  },
  mapCard: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 24,
    backgroundColor: '#071D34',
    borderWidth: 1,
    borderColor: 'rgba(124, 221, 255, 0.20)',
    padding: 10,
  },
  glowA: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(36, 173, 235, 0.16)',
    left: '31%',
    top: 35,
  },
  glowB: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(84, 225, 255, 0.10)',
    right: 24,
    bottom: 16,
  },
  mapFrame: {
    width: '100%',
    aspectRatio: 2,
  },
  hintPill: {
    alignSelf: 'center',
    minHeight: 38,
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 13,
    borderRadius: 18,
    backgroundColor: 'rgba(2, 17, 32, 0.72)',
    borderWidth: 1,
    borderColor: 'rgba(131, 224, 255, 0.18)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  hintDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#68E6FF',
  },
  hintText: {
    color: '#D7F7FF',
    fontSize: 12,
    fontWeight: '700',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 7, 16, 0.58)',
  },
  infoCard: {
    width: '100%',
    maxWidth: 390,
    overflow: 'hidden',
    borderRadius: 26,
    backgroundColor: '#09223E',
    borderWidth: 1,
    borderColor: 'rgba(129, 227, 255, 0.35)',
    padding: 22,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.42,
    shadowRadius: 30,
    elevation: 18,
  },
  infoGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    right: -65,
    top: -85,
    backgroundColor: 'rgba(76, 218, 255, 0.14)',
  },
  infoEyebrow: {
    color: '#63DBFF',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 2,
  },
  countryName: {
    marginTop: 8,
    color: '#FFFFFF',
    fontSize: 33,
    lineHeight: 39,
    fontWeight: '900',
  },
  countryEnglish: {
    marginTop: 3,
    color: '#93B8CA',
    fontSize: 13,
  },
  divider: {
    height: 1,
    marginVertical: 18,
    backgroundColor: 'rgba(128, 222, 255, 0.18)',
  },
  capitalLabel: {
    color: '#93B8CA',
    fontSize: 12,
    fontWeight: '700',
  },
  capitalName: {
    marginTop: 4,
    color: '#EAFBFF',
    fontSize: 25,
    fontWeight: '900',
  },
  closeButton: {
    marginTop: 20,
    minHeight: 48,
    borderRadius: 15,
    backgroundColor: '#E7FAFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButtonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.985 }],
  },
  closeButtonText: {
    color: '#08233A',
    fontSize: 15,
    fontWeight: '900',
  },
});
