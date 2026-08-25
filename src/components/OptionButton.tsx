import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
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

const statusColor: Record<Status, string> = {
  default: colors.optionDefault,
  correct: colors.correct,
  wrong: colors.wrong,
};

export default function OptionButton({ label, status, disabled, onPress, icon }: Props) {
  const useSmallFont = Boolean(icon) || label.includes('\n') || label.length > 6;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: statusColor[status] },
        pressed && styles.pressed,
      ]}
    >
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: 120,
    minHeight: 90,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 5,
    borderBottomColor: 'rgba(0,0,0,0.14)',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  pressed: {
    transform: [{ scale: 0.96 }, { translateY: 1 }],
    borderBottomWidth: 2,
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
