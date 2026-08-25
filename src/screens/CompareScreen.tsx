import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import ProgressBar from '../components/ProgressBar';
import CelebrationOverlay from '../components/CelebrationOverlay';
import MiniCompleteCard from '../components/MiniCompleteCard';
import CompareBasketOption from '../components/compare/CompareBasketOption';
import { generateCompareSet } from '../data/compareData';
import { useLevelRound } from '../hooks/useLevelRound';
import { colors, fonts } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Compare'>;

const ROUND_SIZE = 10;
const COLOR = '#E97DB0';

export default function CompareScreen({ navigation }: Props) {
  const [seed, setSeed] = useState(0);
  const questions = useMemo(() => generateCompareSet(ROUND_SIZE), [seed]);
  const [celebrate, setCelebrate] = useState(false);

  const { question, questionNumber, totalQuestions, wrongPicks, solved, completed, firstTryCorrect, select } =
    useLevelRound({ questions, getAnswer: (q) => q.correctSide });

  const onSelect = (side: 'left' | 'right') => {
    select(side, () => {
      if (questionNumber % 5 === 0) setCelebrate(true);
    });
  };

  const statusFor = (side: 'left' | 'right') => {
    if (solved && side === question.correctSide) return 'correct';
    if (wrongPicks.includes(side)) return 'wrong';
    return 'default';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar current={Math.min(questionNumber, totalQuestions)} total={totalQuestions} color={COLOR} />
      <Text style={styles.prompt}>{question.askMore ? 'Harada daha çoxdur?' : 'Harada daha azdır?'}</Text>
      <View style={styles.row}>
        <CompareBasketOption
          count={question.left}
          emoji={question.emoji}
          status={statusFor('left')}
          disabled={solved}
          side="left"
          onPress={() => onSelect('left')}
        />
        <CompareBasketOption
          count={question.right}
          emoji={question.emoji}
          status={statusFor('right')}
          disabled={solved}
          side="right"
          onPress={() => onSelect('right')}
        />
      </View>
      <CelebrationOverlay visible={celebrate} onDone={() => setCelebrate(false)} />
      {completed && (
        <MiniCompleteCard
          title="Daha Çox və ya Az"
          score={firstTryCorrect}
          total={totalQuestions}
          color={COLOR}
          onPlayAgain={() => setSeed((s) => s + 1)}
          onBackToMenu={() => navigation.navigate('HomeMenu')}
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
  prompt: {
    fontSize: 22,
    fontFamily: fonts.displayBold,
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
  },
});
