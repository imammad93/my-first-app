import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { colors } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const tiles: { title: string; emoji: string; color: string; screen: keyof RootStackParamList }[] = [
  { title: 'Riyaziyyat', emoji: '🔢', color: colors.math, screen: 'Math' },
  { title: 'İngilis dili', emoji: '🗣️', color: colors.english, screen: 'English' },
  { title: 'Əlifba', emoji: '🔤', color: colors.alphabet, screen: 'Alphabet' },
];

export default function HomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Öyrən və Oyna! 🎈</Text>
      <View style={styles.tileList}>
        {tiles.map((tile) => (
          <Pressable
            key={tile.screen}
            onPress={() => navigation.navigate(tile.screen as never)}
            style={({ pressed }) => [
              styles.tile,
              { backgroundColor: tile.color },
              pressed && styles.pressed,
            ]}
          >
            <Text style={styles.tileEmoji}>{tile.emoji}</Text>
            <Text style={styles.tileTitle}>{tile.title}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 24,
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
  tileEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  tileTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.white,
  },
});
