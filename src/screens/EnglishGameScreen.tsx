import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import OptionButton from '../components/OptionButton';
import ProgressBar from '../components/ProgressBar';
import CelebrationOverlay from '../components/CelebrationOverlay';
import LevelCompleteCard from '../components/LevelCompleteCard';
import AnimatedCreature from '../components/AnimatedCreature';
import CreatureStage from '../components/CreatureStage';
import { generateEnglishQuestionSet } from '../data/englishData';
import { englishTierFor } from '../data/difficulty';
import { useAge } from '../context/AgeContext';
import { useLevelRound } from '../hooks/useLevelRound';
import { unlockNextLevel } from '../data/progress';
import { colors } from '../theme';

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

  const statusFor = (option: string) => {
    if (solved && option === question.card.word) return 'correct';
    if (wrongPicks.includes(option)) return 'wrong';
    return 'default';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar current={Math.min(questionNumber, totalQuestions)} total={totalQuestions} color={colors.english} />
      <Text style={styles.prompt}>Bu nədir?</Text>
      <CreatureStage>
        <AnimatedCreature emoji={question.card.emoji} motion={question.card.motion} size={92} />
      </CreatureStage>
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
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
});
