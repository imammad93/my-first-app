import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import ProgressBar from '../components/ProgressBar';
import SceneBackground from '../components/SceneBackground';
import CelebrationOverlay from '../components/CelebrationOverlay';
import MiniCompleteCard from '../components/MiniCompleteCard';
import ClockOption from '../components/clock/ClockOption';
import { generateClockSet } from '../data/clockData';
import { useLevelRound } from '../hooks/useLevelRound';
import { colors, fonts } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Clock'>;

const ROUND_SIZE = 10;
const COLOR = '#4A9FE0';

export default function ClockScreen({ navigation }: Props) {
  const [seed, setSeed] = useState(0);
  const questions = useMemo(() => generateClockSet(ROUND_SIZE), [seed]);
  const [celebrate, setCelebrate] = useState(false);

  const { question, questionNumber, totalQuestions, wrongPicks, solved, completed, firstTryCorrect, select } =
    useLevelRound({ questions, getAnswer: (q) => q.hour });

  const onSelect = (hour: number) => {
    select(hour, () => {
      if (questionNumber % 5 === 0) setCelebrate(true);
    });
  };

  const statusFor = (hour: number) => {
    if (solved && hour === question.hour) return 'correct';
    if (wrongPicks.includes(hour)) return 'wrong';
    return 'default';
  };

  return (
    <SafeAreaView style={styles.container}>
      <SceneBackground subject="clock" />
      <ProgressBar current={Math.min(questionNumber, totalQuestions)} total={totalQuestions} color={COLOR} />
      <View style={styles.promptCard}>
        <Text style={styles.prompt}>Saat {question.hour}:00 hansıdır?</Text>
      </View>
      <View style={styles.options}>
        {question.options.map((h) => (
          <ClockOption key={h} hour={h} status={statusFor(h)} disabled={solved} onPress={() => onSelect(h)} />
        ))}
      </View>
      <CelebrationOverlay visible={celebrate} onDone={() => setCelebrate(false)} />
      {completed && (
        <MiniCompleteCard
          title="Saatı Öyrən"
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
  promptCard: {
    marginTop: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 18,
    paddingHorizontal: 18,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  prompt: {
    fontSize: 22,
    fontFamily: fonts.displayBold,
    color: colors.text,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginTop: 16,
  },
});
