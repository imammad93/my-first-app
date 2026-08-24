import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import InteractiveWorldMap from '../components/worldmap/InteractiveWorldMap';
import WorldMapQuiz from '../components/worldmap/WorldMapQuiz';
import { CONFIG } from '../components/worldmap/mapData';

type Mode = 'explore' | 'quiz';

export default function WorldMapScreen() {
  const [mode, setMode] = useState<Mode>('explore');

  return (
    <View style={[styles.container, { backgroundColor: CONFIG.theme.ocean }]}>
      <View style={styles.switcher}>
        <Pressable
          style={[styles.switchBtn, mode === 'explore' && styles.switchBtnActive]}
          onPress={() => setMode('explore')}
        >
          <Text style={[styles.switchLabel, mode === 'explore' && styles.switchLabelActive]}>🧭 Kəşf</Text>
        </Pressable>
        <Pressable style={[styles.switchBtn, mode === 'quiz' && styles.switchBtnActive]} onPress={() => setMode('quiz')}>
          <Text style={[styles.switchLabel, mode === 'quiz' && styles.switchLabelActive]}>🎯 Oyun</Text>
        </Pressable>
      </View>

      <View style={styles.body}>{mode === 'explore' ? <InteractiveWorldMap /> : <WorldMapQuiz key="quiz" />}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  switcher: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 8,
    backgroundColor: 'rgba(9,75,155,0.55)',
    borderRadius: 999,
    padding: 4,
    gap: 4,
  },
  switchBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999 },
  switchBtnActive: { backgroundColor: '#FFFFFF' },
  switchLabel: { color: '#FFFFFF', fontWeight: '800', fontSize: 13 },
  switchLabelActive: { color: '#094B9B' },
  body: { flex: 1 },
});
