import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import AnimatedCreature from '../components/AnimatedCreature';
import { colors, fonts } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'ComingSoon'>;

export default function ComingSoonScreen({ route }: Props) {
  const { title } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedCreature emoji="🦋" motion="fly" size={72} sound />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>Bu oyun tezliklə əlavə olunacaq!</Text>
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
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.display,
    color: colors.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    fontFamily: fonts.button,
    color: colors.text,
    opacity: 0.7,
    textAlign: 'center',
  },
});
