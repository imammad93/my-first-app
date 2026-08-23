import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function CreatureStage({ children }: { children: React.ReactNode }) {
  return <View style={styles.stage}>{children}</View>;
}

const styles = StyleSheet.create({
  stage: {
    width: '100%',
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
  },
});
