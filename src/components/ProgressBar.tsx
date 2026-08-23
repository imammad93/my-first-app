import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

type Props = {
  current: number;
  total: number;
  color: string;
};

export default function ProgressBar({ current, total, color }: Props) {
  const ratio = Math.min(1, current / total);
  return (
    <View style={styles.wrapper}>
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
  wrapper: {
    width: '86%',
    marginTop: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
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
