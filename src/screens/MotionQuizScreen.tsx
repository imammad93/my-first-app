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
import { generateMotionQuizSet, MOTION_LABELS } from '../data/motionQuizData';
import { useLevelRound } from '../hooks/useLevelRound';
import { colors, fonts } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'MotionQuiz'>;

const ROUND_SIZE = 10;
const COLOR = '#5AA9E6';

export default function MotionQuizScreen({ navigation }: Props) {
  return <Round key={0} navigation={navigation} />;
}

function Round({ navigation }: { navigation: Props['navigation'] }) {
  const [seed, setSeed] = useState(0);
  const questions = useMemo(() => generateMotionQuizSet(ROUND_SIZE), [seed]);
  const [celebrate, setCelebrate] = useState(false);

  const { question, questionNumber, totalQuestions, wrongPicks, solved, completed, firstTryCorrect, select } =
    useLevelRound({ questions, getAnswer: (q) => q.correctWord });

  const onSelect = (word: string) => {
    select(word, () => {
      if (questionNumber % 5 === 0) setCelebrate(true);
    });
  };

  const statusFor = (word: string) => {
    if (solved && word === question.correctWord) return 'correct';
    if (wrongPicks.includes(word)) return 'wrong';
    return 'default';
  };

  return (
    <SafeAreaView style={styles.container}>
      <SceneBackground subject="motion" />
      <ProgressBar current={Math.min(questionNumber, totalQuestions)} total={totalQuestions} color={COLOR} />
      <View style={styles.promptCard}>
        <Text style={styles.prompt}>Hansı heyvan {MOTION_LABELS[question.motion]}?</Text>
      </View>
      <View style={styles.options}>
        {question.options.map((card) => (
          <OptionButton
            key={card.word}
            label={card.word}
            icon={<AnimatedCreature emoji={card.emoji} motion={card.motion} size={48} />}
            status={statusFor(card.word)}
            disabled={solved}
            onPress={() => onSelect(card.word)}
          />
        ))}
      </View>
      <CelebrationOverlay visible={celebrate} onDone={() => setCelebrate(false)} />
      {completed && (
        <MiniCompleteCard
          title="Hərəkəti Tap"
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
    marginHorizontal: 20,
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
    fontSize: 20,
    fontFamily: fonts.displayBold,
    color: colors.text,
    textAlign: 'center',
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
});
