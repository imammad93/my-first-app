import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors } from '../theme';

type Status = 'default' | 'correct' | 'wrong';

type Props = {
  label: string;
  status: Status;
  disabled?: boolean;
  onPress: () => void;
};

const statusColor: Record<Status, string> = {
  default: colors.optionDefault,
  correct: colors.correct,
  wrong: colors.wrong,
};

export default function OptionButton({ label, status, disabled, onPress }: Props) {
  const isMultiline = label.includes('\n');

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: statusColor[status] },
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.label,
          isMultiline && styles.labelMultiline,
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
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  pressed: {
    transform: [{ scale: 0.96 }],
  },
  label: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  labelMultiline: {
    fontSize: 18,
  },
  labelOnColor: {
    color: colors.white,
  },
});
