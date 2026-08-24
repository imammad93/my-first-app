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
import { generateAlphabetQuestionSet } from '../data/alphabetData';
import { alphabetModeFor } from '../data/difficulty';
import { useAge } from '../context/AgeContext';
import { useLevelRound } from '../hooks/useLevelRound';
import { unlockNextLevel } from '../data/progress';
import { colors, fonts } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Alphabet'>;

export default function AlphabetGameScreen({ route, navigation }: Props) {
  return <AlphabetLevelRound key={route.params.level} level={route.params.level} navigation={navigation} />;
}

function AlphabetLevelRound({ level, navigation }: { level: number; navigation: Props['navigation'] }) {
  const { age } = useAge();
  const mode = useMemo(() => alphabetModeFor(age, level), [age, level]);
  const questions = useMemo(() => generateAlphabetQuestionSet(mode), [mode]);
  const [celebrate, setCelebrate] = useState(false);

  const { question, questionNumber, totalQuestions, wrongPicks, solved, completed, stars, select } =
    useLevelRound({
      questions,
      getAnswer: (q) => q.target.letter,
    });

  const onSelect = (letter: string) => {
    select(letter, () => {
      if (questionNumber % 5 === 0) setCelebrate(true);
    });
  };

  const statusFor = (letter: string) => {
    if (solved && letter === question.target.letter) return 'correct';
    if (wrongPicks.includes(letter)) return 'wrong';
    return 'default';
  };

  const isLowerMode = question.mode === 'pick-picture-lower';
  const displayLetter = isLowerMode ? question.target.letter.toLowerCase() : question.target.letter;

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar
        current={Math.min(questionNumber, totalQuestions)}
        total={totalQuestions}
        color={colors.alphabet}
      />

      {question.mode === 'pick-letter' ? (
        <>
          <Text style={styles.prompt}>Bu hansı hərflə başlayır?</Text>
          <CreatureStage>
            <AnimatedCreature emoji={question.target.emoji} motion={question.target.motion} size={92} />
          </CreatureStage>
          <View style={styles.options}>
            {question.letterOptions.map((letter) => (
              <OptionButton
                key={letter}
                label={letter}
                status={statusFor(letter)}
                disabled={solved}
                onPress={() => onSelect(letter)}
              />
            ))}
          </View>
        </>
      ) : (
        <>
          <Text style={styles.prompt}>Bu hərflə başlayanı tap:</Text>
          <Text style={styles.letter}>{displayLetter}</Text>
          <View style={styles.options}>
            {question.itemOptions.map((item) => (
              <OptionButton
                key={item.letter}
                label={item.word}
                icon={<AnimatedCreature emoji={item.emoji} motion="idle" size={30} />}
                status={statusFor(item.letter)}
                disabled={solved}
                onPress={() => onSelect(item.letter)}
              />
            ))}
          </View>
        </>
      )}

      <CelebrationOverlay visible={celebrate} onDone={() => setCelebrate(false)} />
      {completed && (
        <LevelCompleteCard
          level={level}
          stars={stars}
          color={colors.alphabet}
          onNextLevel={async () => {
            await unlockNextLevel('Alphabet', age, level);
            navigation.setParams({ level: level + 1 });
          }}
          onBackToLevels={async () => {
            await unlockNextLevel('Alphabet', age, level);
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
    fontFamily: fonts.displayBold,
    color: colors.text,
    marginTop: 12,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  letter: {
    fontSize: 96,
    fontFamily: fonts.display,
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
