import React, { useCallback, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import OptionButton from '../components/OptionButton';
import ScoreBadge from '../components/ScoreBadge';
import CelebrationOverlay from '../components/CelebrationOverlay';
import { AlphabetQuestion, generateAlphabetQuestion } from '../data/alphabetData';
import { colors } from '../theme';

export default function AlphabetGameScreen() {
  const [question, setQuestion] = useState<AlphabetQuestion>(() => generateAlphabetQuestion());
  const [wrongOptions, setWrongOptions] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState(0);
  const [celebrate, setCelebrate] = useState(false);

  const nextQuestion = useCallback(() => {
    setQuestion(generateAlphabetQuestion());
    setWrongOptions([]);
    setSolved(false);
  }, []);

  const onSelect = (letter: string) => {
    if (solved) return;

    if (letter === question.target.letter) {
      setSolved(true);
      const newScore = score + 1;
      setScore(newScore);
      if (newScore % 5 === 0) {
        setCelebrate(true);
      }
      setTimeout(nextQuestion, 900);
    } else {
      setWrongOptions((prev) => [...prev, letter]);
    }
  };

  const statusFor = (letter: string) => {
    if (solved && letter === question.target.letter) return 'correct';
    if (wrongOptions.includes(letter)) return 'wrong';
    return 'default';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScoreBadge score={score} />
      <Text style={styles.prompt}>Bu hərflə başlayanı tap:</Text>
      <Text style={styles.letter}>{question.target.letter}</Text>
      <View style={styles.options}>
        {question.options.map((item) => (
          <OptionButton
            key={item.letter}
            label={`${item.emoji}\n${item.word}`}
            status={statusFor(item.letter)}
            disabled={solved}
            onPress={() => onSelect(item.letter)}
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
  prompt: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  letter: {
    fontSize: 96,
    fontWeight: '800',
    color: colors.alphabet,
    marginVertical: 16,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
});
