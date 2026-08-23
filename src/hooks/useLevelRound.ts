import { useCallback, useState } from 'react';
import { QUESTIONS_PER_LEVEL } from '../data/difficulty';

type Args<Q, A> = {
  generateQuestion: () => Q;
  getAnswer: (question: Q) => A;
};

export function useLevelRound<Q, A>({ generateQuestion, getAnswer }: Args<Q, A>) {
  const [question, setQuestion] = useState<Q>(() => generateQuestion());
  const [answeredCount, setAnsweredCount] = useState(0);
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [wrongPicks, setWrongPicks] = useState<A[]>([]);
  const [solved, setSolved] = useState(false);
  const [completed, setCompleted] = useState(false);

  const select = useCallback(
    (pick: A, onAdvance: () => void) => {
      if (solved || completed) return;

      if (pick === getAnswer(question)) {
        setSolved(true);
        if (wrongPicks.length === 0) setFirstTryCorrect((c) => c + 1);

        setTimeout(() => {
          const nextAnswered = answeredCount + 1;
          setAnsweredCount(nextAnswered);
          if (nextAnswered >= QUESTIONS_PER_LEVEL) {
            setCompleted(true);
          } else {
            setQuestion(generateQuestion());
            setWrongPicks([]);
            setSolved(false);
          }
          onAdvance();
        }, 900);
      } else {
        setWrongPicks((prev) => [...prev, pick]);
      }
    },
    [solved, completed, question, wrongPicks, answeredCount, getAnswer, generateQuestion]
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
    questionNumber: Math.min(answeredCount + 1, QUESTIONS_PER_LEVEL),
    totalQuestions: QUESTIONS_PER_LEVEL,
    wrongPicks,
    solved,
    completed,
    stars,
    select,
  };
}
