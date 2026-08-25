import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import OptionButton from '../components/OptionButton';
import ProgressBar from '../components/ProgressBar';
import SceneBackground from '../components/SceneBackground';
import CelebrationOverlay from '../components/CelebrationOverlay';
import MiniCompleteCard from '../components/MiniCompleteCard';
import AnimatedCreature from '../components/AnimatedCreature';
import { generateNumberSet } from '../data/numbersData';
import { useLevelRound } from '../hooks/useLevelRound';
import { colors, fonts } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Numbers'>;

const ROUND_SIZE = 10;
const COLOR = '#4CAF7A';

export default function NumbersScreen({ navigation }: Props) {
  const [seed, setSeed] = useState(0);
  const questions = useMemo(() => generateNumberSet(ROUND_SIZE), [seed]);
  const [celebrate, setCelebrate] = useState(false);

  const { question, questionNumber, totalQuestions, wrongPicks, solved, completed, firstTryCorrect, select } =
    useLevelRound({ questions, getAnswer: (q) => q.count });

  const onSelect = (n: number) => {
    select(n, () => {
      if (questionNumber % 5 === 0) setCelebrate(true);
    });
  };

  const statusFor = (n: number) => {
    if (solved && n === question.count) return 'correct';
    if (wrongPicks.includes(n)) return 'wrong';
    return 'default';
  };

  return (
    <SafeAreaView style={styles.container}>
      <SceneBackground subject="math" />
      <ProgressBar current={Math.min(questionNumber, totalQuestions)} total={totalQuestions} color={COLOR} />
      <View style={styles.promptCard}>
        <Text style={styles.prompt}>Neçə dənədir?</Text>
      </View>
      <View style={styles.gridCard}>
        <View style={styles.grid}>
          {Array.from({ length: question.count }, (_, i) => (
            <View key={i} style={styles.item}>
              <AnimatedCreature emoji={question.emoji} motion="idle" size={40} preferEmoji />
            </View>
          ))}
        </View>
      </View>
      <View style={styles.options}>
        {question.options.map((n) => (
          <OptionButton key={n} label={String(n)} status={statusFor(n)} disabled={solved} onPress={() => onSelect(n)} />
        ))}
      </View>
      <CelebrationOverlay visible={celebrate} onDone={() => setCelebrate(false)} />
      {completed && (
        <MiniCompleteCard
          title="Sayıları Öyrən"
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
  gridCard: {
    marginVertical: 16,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 24,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.14,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 32,
    maxWidth: 320,
  },
  item: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
});
