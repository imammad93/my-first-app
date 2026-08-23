import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

export default function ScoreBadge({ score }: { score: number }) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>⭐ {score}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 3,
  },
  text: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
});
