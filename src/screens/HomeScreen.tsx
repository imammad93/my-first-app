import React from 'react';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useAge } from '../context/AgeContext';
import { MAX_AGE, MIN_AGE } from '../data/difficulty';
import AnimatedCreature from '../components/AnimatedCreature';
import { colors, fonts } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const tiles: { title: string; emoji: string; color: string; game: 'Math' | 'English' | 'Alphabet' }[] = [
  { title: 'Riyaziyyat', emoji: '🔢', color: colors.math, game: 'Math' },
  { title: 'İngilis dili', emoji: '🗣️', color: colors.english, game: 'English' },
  { title: 'Əlifba', emoji: '🔤', color: colors.alphabet, game: 'Alphabet' },
];

const ages = Array.from({ length: MAX_AGE - MIN_AGE + 1 }, (_, i) => MIN_AGE + i);

export default function HomeScreen({ navigation }: Props) {
  const { age, setAge, ready } = useAge();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Öyrən və Oyna! 🎈</Text>

      <Text style={styles.ageLabel}>Yaşını seç</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ageRow} contentContainerStyle={styles.ageRowContent}>
        {ages.map((a) => (
          <Pressable
            key={a}
            onPress={() => setAge(a)}
            style={[styles.ageChip, ready && a === age && styles.ageChipSelected]}
          >
            <Text style={[styles.ageChipLabel, ready && a === age && styles.ageChipLabelSelected]}>{a}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.tileList}>
        {tiles.map((tile) => (
          <Pressable
            key={tile.game}
            onPress={() => navigation.navigate('LevelSelect', { game: tile.game })}
            style={({ pressed }) => [
              styles.tile,
              { backgroundColor: tile.color },
              pressed && styles.pressed,
            ]}
          >
            <View style={styles.tileIconWrap}>
              <AnimatedCreature emoji={tile.emoji} motion="idle" size={44} />
            </View>
            <Text style={styles.tileTitle}>{tile.title}</Text>
          </Pressable>
        ))}

        <Pressable
          onPress={() => navigation.navigate('WorldMap')}
          style={({ pressed }) => [styles.tile, { backgroundColor: '#0A6BB5' }, pressed && styles.pressed]}
        >
          <View style={styles.tileIconWrap}>
            <AnimatedCreature emoji="🌍" motion="idle" size={44} />
          </View>
          <Text style={styles.tileTitle}>Dünya Xəritəsi</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 32,
  },
  title: {
    fontSize: 30,
    fontFamily: fonts.display,
    color: colors.text,
    marginBottom: 16,
  },
  ageLabel: {
    fontSize: 14,
    fontFamily: fonts.buttonBold,
    color: colors.text,
    marginBottom: 8,
  },
  ageRow: {
    maxHeight: 56,
    marginBottom: 16,
  },
  ageRowContent: {
    paddingHorizontal: 16,
  },
  ageChip: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
    elevation: 2,
  },
  ageChipSelected: {
    backgroundColor: colors.home,
  },
  ageChipLabel: {
    fontSize: 16,
    fontFamily: fonts.buttonBold,
    color: colors.text,
  },
  ageChipLabelSelected: {
    color: colors.white,
  },
  tileList: {
    width: '100%',
    paddingHorizontal: 24,
  },
  tile: {
    borderRadius: 24,
    paddingVertical: 28,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  pressed: {
    transform: [{ scale: 0.97 }],
  },
  tileIconWrap: {
    marginBottom: 8,
  },
  tileTitle: {
    fontSize: 24,
    fontFamily: fonts.display,
    color: colors.white,
  },
});
