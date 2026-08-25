import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function CreatureStage({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.stage}>
      <View style={styles.platform} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  stage: {
    width: '100%',
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
  platform: {
    position: 'absolute',
    bottom: 12,
    width: '62%',
    height: 26,
    borderRadius: 999,
    backgroundColor: 'rgba(0,0,0,0.10)',
  },
});
