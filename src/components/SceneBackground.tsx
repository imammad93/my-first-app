import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { gradients } from '../theme';

type Subject = keyof typeof gradients;

type Props = {
  subject: Subject;
};

/**
 * A gradient scene with soft light-glow blobs behind the question card, replacing the flat
 * single-color background so subject screens read as a lit 3D space instead of a flat fill.
 */
export default function SceneBackground({ subject }: Props) {
  const [deep, light] = gradients[subject];

  return (
    <View style={styles.fill} pointerEvents="none">
      <LinearGradient colors={[light, deep]} start={{ x: 0.2, y: 0 }} end={{ x: 0.8, y: 1 }} style={styles.fill} />
      <View style={[styles.glow, styles.glowTopLeft]} />
      <View style={[styles.glow, styles.glowBottomRight]} />
      <View style={styles.floor} />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
  glow: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.22)',
  },
  glowTopLeft: {
    width: 260,
    height: 260,
    top: -90,
    left: -70,
  },
  glowBottomRight: {
    width: 340,
    height: 340,
    bottom: -160,
    right: -110,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  floor: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '38%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
});
