import React, { useEffect, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { getSoundEnabled, setSoundEnabled } from '../data/settings';
import { colors, fonts } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Music'>;

export default function MusicScreen({}: Props) {
  const [enabled, setEnabled] = useState<boolean | null>(null);

  useEffect(() => {
    getSoundEnabled().then(setEnabled);
  }, []);

  const toggle = async () => {
    if (enabled === null) return;
    const next = !enabled;
    setEnabled(next);
    await setSoundEnabled(next);
  };

  if (enabled === null) return <SafeAreaView style={styles.container} />;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.emoji}>{enabled ? '🔊' : '🔇'}</Text>
      <Text style={styles.title}>{enabled ? 'Səs açıqdır' : 'Səs bağlıdır'}</Text>
      <Text style={styles.subtitle}>
        Bu tənzimləmə yadda saxlanılır. Hazırda tətbiqdə musiqi faylları yoxdur, amma bu seçim gələcək
        səs effektləri üçün istifadə olunacaq.
      </Text>
      <Pressable
        style={[styles.toggle, { backgroundColor: enabled ? colors.correct : '#C9C4DE' }]}
        onPress={toggle}
        accessibilityRole="switch"
        accessibilityState={{ checked: enabled }}
        accessibilityLabel="Səs"
      >
        <View style={[styles.knob, enabled && styles.knobOn]} />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    gap: 10,
  },
  emoji: { fontSize: 56 },
  title: { fontSize: 22, fontFamily: fonts.display, color: colors.text },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.button,
    color: colors.text,
    opacity: 0.65,
    textAlign: 'center',
    marginBottom: 16,
  },
  toggle: {
    width: 74,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  knob: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.white,
  },
  knobOn: {
    alignSelf: 'flex-end',
  },
});
