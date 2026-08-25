import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts } from '../theme';
import ScorePopup from './ScorePopup';

type Status = 'default' | 'correct' | 'wrong';

type Props = {
  label: string;
  status: Status;
  disabled?: boolean;
  onPress: () => void;
  icon?: React.ReactNode;
};

const statusGradient: Record<Status, readonly [string, string]> = {
  default: ['#FFFFFF', '#EDEAF6'],
  correct: ['#6FCF87', '#3FA663'],
  wrong: ['#F5928A', '#DE5A50'],
};

export default function OptionButton({ label, status, disabled, onPress, icon }: Props) {
  const useSmallFont = Boolean(icon) || label.includes('\n') || label.length > 6;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [styles.shadowWrap, pressed && styles.pressed]}
    >
      <LinearGradient colors={statusGradient[status]} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={styles.button}>
        <View style={styles.sheen} />
        {status === 'correct' && <ScorePopup />}
        {icon && <View style={styles.iconWrap}>{icon}</View>}
        <Text
          style={[
            styles.label,
            useSmallFont && styles.labelSmall,
            status !== 'default' && styles.labelOnColor,
          ]}
        >
          {label}
        </Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    margin: 10,
    borderRadius: 26,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 9,
  },
  pressed: {
    transform: [{ scale: 0.96 }, { translateY: 2 }],
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  button: {
    minWidth: 120,
    minHeight: 90,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(0,0,0,0.16)',
    overflow: 'hidden',
  },
  sheen: {
    position: 'absolute',
    top: 4,
    left: '12%',
    right: '12%',
    height: '42%',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  iconWrap: {
    marginBottom: 4,
  },
  label: {
    fontSize: 26,
    fontFamily: fonts.button,
    color: colors.text,
    textAlign: 'center',
  },
  labelSmall: {
    fontSize: 17,
  },
  labelOnColor: {
    color: colors.white,
  },
});
