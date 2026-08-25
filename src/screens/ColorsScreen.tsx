import React, { useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import ProgressBar from '../components/ProgressBar';
import CelebrationOverlay from '../components/CelebrationOverlay';
import MiniCompleteCard from '../components/MiniCompleteCard';
import PaintDrop from '../components/colors/PaintDrop';
import ColorTarget from '../components/colors/ColorTarget';
import { generateColorSet } from '../data/colorsData';
import { useLevelRound } from '../hooks/useLevelRound';
import { colors, fonts } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Colors'>;

const ROUND_SIZE = 10;
const COLOR = '#FF9F3D';

export default function ColorsScreen({ navigation }: Props) {
  const [seed, setSeed] = useState(0);
  const questions = useMemo(() => generateColorSet(ROUND_SIZE), [seed]);
  const [celebrate, setCelebrate] = useState(false);

  const { question, questionNumber, totalQuestions, wrongPicks, solved, completed, firstTryCorrect, select } =
    useLevelRound({ questions, getAnswer: (q) => q.target.name });

  const onSelect = (name: string) => {
    select(name, () => {
      if (questionNumber % 5 === 0) setCelebrate(true);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressBar current={Math.min(questionNumber, totalQuestions)} total={totalQuestions} color={COLOR} />
      <Text style={styles.prompt}>{question.target.name} rəngi hansıdır?</Text>
      <ColorTarget hex={question.target.hex} splash={solved} />
      <View style={styles.options}>
        {question.options.map((c) => (
          <PaintDrop
            key={c.name}
            name={c.name}
            hex={c.hex}
            wrong={wrongPicks.includes(c.name)}
            disabled={solved}
            onPress={() => onSelect(c.name)}
          />
        ))}
      </View>
      <CelebrationOverlay visible={celebrate} onDone={() => setCelebrate(false)} />
      {completed && (
        <MiniCompleteCard
          title="Rənglər"
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
    fontSize: 20,
    fontFamily: fonts.displayBold,
    color: colors.text,
    marginTop: 12,
    marginBottom: 16,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 12,
    marginTop: 24,
  },
});
