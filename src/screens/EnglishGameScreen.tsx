import React, { useCallback, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import OptionButton from '../components/OptionButton';
import ScoreBadge from '../components/ScoreBadge';
import CelebrationOverlay from '../components/CelebrationOverlay';
import { EnglishQuestion, generateEnglishQuestion } from '../data/englishData';
import { colors } from '../theme';

export default function EnglishGameScreen() {
  const [question, setQuestion] = useState<EnglishQuestion>(() => generateEnglishQuestion());
  const [wrongOptions, setWrongOptions] = useState<string[]>([]);
  const [solved, setSolved] = useState(false);
  const [score, setScore] = useState(0);
  const [celebrate, setCelebrate] = useState(false);

  const nextQuestion = useCallback(() => {
    setQuestion(generateEnglishQuestion());
    setWrongOptions([]);
    setSolved(false);
  }, []);

  const onSelect = (option: string) => {
    if (solved) return;

    if (option === question.card.word) {
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

  const statusFor = (option: string) => {
    if (solved && option === question.card.word) return 'correct';
    if (wrongOptions.includes(option)) return 'wrong';
    return 'default';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScoreBadge score={score} />
      <Text style={styles.prompt}>Bu nədir?</Text>
      <Text style={styles.emoji}>{question.card.emoji}</Text>
      <View style={styles.options}>
        {question.options.map((option) => (
          <OptionButton
            key={option}
            label={option}
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
  prompt: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
  },
  emoji: {
    fontSize: 96,
    marginVertical: 24,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
});
