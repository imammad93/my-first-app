import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

type Props = {
  current: number;
  total: number;
  color: string;
};

export default function ProgressBar({ current, total, color }: Props) {
  const ratio = Math.min(1, current / total);
  return (
    <View style={styles.card}>
      <Text style={styles.label}>
        Sual {current}/{total}
      </Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${ratio * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '86%',
    marginTop: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  label: {
    fontSize: 13,
    fontFamily: fonts.buttonBold,
    color: colors.text,
    marginBottom: 4,
  },
  track: {
    height: 10,
    borderRadius: 6,
    backgroundColor: '#E7E2F5',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 6,
  },
});
