import { useCallback, useState } from 'react';
import { QUESTIONS_PER_LEVEL } from '../data/difficulty';

type Args<Q, A> = {
  questions: Q[];
  getAnswer: (question: Q) => A;
};

export function useLevelRound<Q, A>({ questions, getAnswer }: Args<Q, A>) {
  const [index, setIndex] = useState(0);
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [wrongPicks, setWrongPicks] = useState<A[]>([]);
  const [solved, setSolved] = useState(false);
  const [completed, setCompleted] = useState(false);

  const question = questions[Math.min(index, questions.length - 1)];

  const select = useCallback(
    (pick: A, onAdvance: () => void) => {
      if (solved || completed) return;

      if (pick === getAnswer(question)) {
        setSolved(true);
        if (wrongPicks.length === 0) setFirstTryCorrect((c) => c + 1);

        setTimeout(() => {
          const nextIndex = index + 1;
          if (nextIndex >= questions.length) {
            setCompleted(true);
          } else {
            setIndex(nextIndex);
            setWrongPicks([]);
            setSolved(false);
          }
          onAdvance();
        }, 900);
      } else {
        setWrongPicks((prev) => [...prev, pick]);
      }
    },
    [solved, completed, question, wrongPicks, index, questions.length, getAnswer]
  );

  const stars = completed
    ? firstTryCorrect >= QUESTIONS_PER_LEVEL * 0.9
      ? 3
      : firstTryCorrect >= QUESTIONS_PER_LEVEL * 0.6
        ? 2
        : 1
    : 0;

  return {
    question,
    questionNumber: Math.min(index + 1, questions.length),
    totalQuestions: questions.length,
    wrongPicks,
    solved,
    completed,
    stars,
    firstTryCorrect,
    select,
  };
}
