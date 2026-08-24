import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import OptionButton from '../components/OptionButton';
import ProgressBar from '../components/ProgressBar';
import CelebrationOverlay from '../components/CelebrationOverlay';
import LevelCompleteCard from '../components/LevelCompleteCard';
import { generateMathQuestionSet } from '../data/mathData';
import MathBasketGame from '../components/math/MathBasketGame';
import { mathDifficultyFor } from '../data/difficulty';
import { useAge } from '../context/AgeContext';
import { useLevelRound } from '../hooks/useLevelRound';
import { unlockNextLevel } from '../data/progress';
import { colors, fonts } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Math'>;

export default function MathGameScreen({ route, navigation }: Props) {
  return <MathLevelRound key={route.params.level} level={route.params.level} navigation={navigation} />;
}

function MathLevelRound({ level, navigation }: { level: number; navigation: Props['navigation'] }) {
  const { age } = useAge();
  const difficulty = useMemo(() => mathDifficultyFor(age, level), [age, level]);
  const questions = useMemo(() => generateMathQuestionSet(difficulty), [difficulty]);
  const [celebrate, setCelebrate] = useState(false);

  const { question, questionNumber, totalQuestions, wrongPicks, solved, completed, stars, select } =
    useLevelRound({
      questions,
      getAnswer: (q) => q.answer,
    });

  const onSelect = (option: number) => {
    select(option, () => {
      const nextScore = questionNumber;
      if (nextScore % 5 === 0) setCelebrate(true);
    });
  };

  const statusFor = (option: number) => {
    if (solved && option === question.answer) return 'correct';
    if (wrongPicks.includes(option)) return 'wrong';
    return 'default';
  };

  const basketOp = question.op === '+' || question.op === '-' ? question.op : null;
  const showBaskets = basketOp !== null && question.a <= 12 && question.b <= 12;

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar current={Math.min(questionNumber, totalQuestions)} total={totalQuestions} color={colors.math} />
      <View style={styles.card}>
        {showBaskets && basketOp ? (
          <MathBasketGame
            key={`${question.a}-${question.op}-${question.b}`}
            a={question.a}
            b={question.b}
            op={basketOp}
            solved={solved}
          />
        ) : null}
        <Text style={styles.equation}>
          {question.a} {question.op} {question.b} = ?
        </Text>
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
      {completed && (
        <LevelCompleteCard
          level={level}
          stars={stars}
          color={colors.math}
          onNextLevel={async () => {
            await unlockNextLevel('Math', age, level);
            navigation.setParams({ level: level + 1 });
          }}
          onBackToLevels={async () => {
            await unlockNextLevel('Math', age, level);
            navigation.goBack();
          }}
        />
      )}
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
  equation: {
    fontSize: 40,
    fontFamily: fonts.display,
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
