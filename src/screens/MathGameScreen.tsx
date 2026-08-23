import React, { useCallback, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import OptionButton from '../components/OptionButton';
import ScoreBadge from '../components/ScoreBadge';
import CelebrationOverlay from '../components/CelebrationOverlay';
import { emojiRow, generateMathQuestion, MathQuestion } from '../data/mathData';
import { colors } from '../theme';

export default function MathGameScreen() {
  const [question, setQuestion] = useState<MathQuestion>(() => generateMathQuestion());
  const [wrongOptions, setWrongOptions] = useState<number[]>([]);
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState(0);
  const [celebrate, setCelebrate] = useState(false);

  const nextQuestion = useCallback(() => {
    setQuestion(generateMathQuestion());
    setWrongOptions([]);
    setSolved(false);
  }, []);

  const onSelect = (option: number) => {
    if (solved) return;

    if (option === question.answer) {
      setSolved(true);
      const newScore = score + 1;
      setScore(newScore);
      if (newScore % 5 === 0) {
        setCelebrate(true);
      }
      setTimeout(nextQuestion, 900);
    } else {
      setWrongOptions((prev) => [...prev, option]);
    }
  };

  const statusFor = (option: number) => {
    if (solved && option === question.answer) return 'correct';
    if (wrongOptions.includes(option)) return 'wrong';
    return 'default';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScoreBadge score={score} />
      <View style={styles.card}>
        <Text style={styles.emojiRow}>{emojiRow(question.a)}</Text>
        <Text style={styles.equation}>
          {question.a} {question.op} {question.b} = ?
        </Text>
        {question.op === '-' && <Text style={styles.emojiRow}>{emojiRow(question.b)}</Text>}
      </View>
      <View style={styles.options}>
        {question.options.map((option) => (
          <OptionButton
            key={option}
            label={String(option)}
            status={statusFor(option)}
            disabled={solved}
            onPress={() => onSelect(option)}
          />
        ))}
      </View>
      <CelebrationOverlay visible={celebrate} onDone={() => setCelebrate(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    paddingTop: 24,
  },
  card: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
  },
  emojiRow: {
    fontSize: 28,
    letterSpacing: 2,
    marginVertical: 4,
  },
  equation: {
    fontSize: 44,
    fontWeight: '800',
    color: colors.math,
    marginVertical: 8,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
});
