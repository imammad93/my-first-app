import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import OptionButton from '../components/OptionButton';
import ProgressBar from '../components/ProgressBar';
import SceneBackground from '../components/SceneBackground';
import CelebrationOverlay from '../components/CelebrationOverlay';
import MiniCompleteCard from '../components/MiniCompleteCard';
import ShapeIcon from '../components/shapes/ShapeIcon';
import { generateShapeSet } from '../data/shapesData';
import { useLevelRound } from '../hooks/useLevelRound';
import { colors, fonts } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Shapes'>;

const ROUND_SIZE = 10;
const COLOR = '#8B7CF6';

export default function ShapesScreen({ navigation }: Props) {
  const [seed, setSeed] = useState(0);
  const questions = useMemo(() => generateShapeSet(ROUND_SIZE), [seed]);
  const [celebrate, setCelebrate] = useState(false);

  const { question, questionNumber, totalQuestions, wrongPicks, solved, completed, firstTryCorrect, select } =
    useLevelRound({ questions, getAnswer: (q) => q.target.name });

  const onSelect = (name: string) => {
    select(name, () => {
      if (questionNumber % 5 === 0) setCelebrate(true);
    });
  };

  const statusFor = (name: string) => {
    if (solved && name === question.target.name) return 'correct';
    if (wrongPicks.includes(name)) return 'wrong';
    return 'default';
  };

  return (
    <SafeAreaView style={styles.container}>
      <SceneBackground subject="english" />
      <ProgressBar current={Math.min(questionNumber, totalQuestions)} total={totalQuestions} color={COLOR} />
      <View style={styles.promptCard}>
        <Text style={styles.prompt}>{question.target.name} hansıdır?</Text>
      </View>
      <View style={styles.options}>
        {question.options.map((s) => (
          <OptionButton
            key={s.name}
            label={s.name}
            icon={<ShapeIcon type={s.type} />}
            status={statusFor(s.name)}
            disabled={solved}
            onPress={() => onSelect(s.name)}
          />
        ))}
      </View>
      <CelebrationOverlay visible={celebrate} onDone={() => setCelebrate(false)} />
      {completed && (
        <MiniCompleteCard
          title="Formalar"
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
