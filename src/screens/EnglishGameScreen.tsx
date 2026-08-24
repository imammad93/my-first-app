import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import ProgressBar from '../components/ProgressBar';
import CelebrationOverlay from '../components/CelebrationOverlay';
import LevelCompleteCard from '../components/LevelCompleteCard';
import WordTrainGame from '../components/english/WordTrainGame';
import { generateEnglishQuestionSet } from '../data/englishData';
import { englishTierFor } from '../data/difficulty';
import { useAge } from '../context/AgeContext';
import { useLevelRound } from '../hooks/useLevelRound';
import { unlockNextLevel } from '../data/progress';
import { colors, fonts } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'English'>;

export default function EnglishGameScreen({ route, navigation }: Props) {
  return <EnglishLevelRound key={route.params.level} level={route.params.level} navigation={navigation} />;
}

function EnglishLevelRound({ level, navigation }: { level: number; navigation: Props['navigation'] }) {
  const { age } = useAge();
  const tier = useMemo(() => englishTierFor(age, level), [age, level]);
  const questions = useMemo(() => generateEnglishQuestionSet(tier), [tier]);
  const [celebrate, setCelebrate] = useState(false);

  const { question, questionNumber, totalQuestions, wrongPicks, solved, completed, stars, select } =
    useLevelRound({
      questions,
      getAnswer: (q) => q.card.word,
    });

  const onSelect = (option: string) => {
    select(option, () => {
      if (questionNumber % 5 === 0) setCelebrate(true);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar current={Math.min(questionNumber, totalQuestions)} total={totalQuestions} color={colors.english} />
      <Text style={styles.prompt}>Bu nədir? Doğru sözün vaqonuna göndər!</Text>
      <WordTrainGame
        key={question.card.word}
        emoji={question.card.emoji}
        motion={question.card.motion}
        options={question.options}
        correctWord={question.card.word}
        wrongPicks={wrongPicks}
        solved={solved}
        disabled={solved}
        onPick={onSelect}
      />
      <CelebrationOverlay visible={celebrate} onDone={() => setCelebrate(false)} />
      {completed && (
        <LevelCompleteCard
          level={level}
          stars={stars}
          color={colors.english}
          onNextLevel={async () => {
            await unlockNextLevel('English', age, level);
            navigation.setParams({ level: level + 1 });
          }}
          onBackToLevels={async () => {
            await unlockNextLevel('English', age, level);
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
  prompt: {
    fontSize: 18,
    fontFamily: fonts.displayBold,
    color: colors.text,
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
