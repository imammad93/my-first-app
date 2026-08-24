import { randomInt, shuffle } from '../utils/random';
import { generateUniqueSet } from '../utils/uniqueSet';
import { MathDifficulty, QUESTIONS_PER_LEVEL } from './difficulty';

export type MathQuestion = {
  a: number;
  b: number;
  op: '+' | '-' | '×' | '÷';
  answer: number;
  options: number[];
};

function distractorsFor(answer: number): number[] {
  const pool = new Set<number>();
  while (pool.size < 2) {
    const delta = randomInt(-3, 3);
    const candidate = answer + delta;
    if (candidate >= 0 && candidate !== answer) {
      pool.add(candidate);
    }
  }
  return [...pool];
}

function buildQuestion(a: number, b: number, op: MathQuestion['op'], answer: number): MathQuestion {
  const options = shuffle([answer, ...distractorsFor(answer)]);
  return { a, b, op, answer, options };
}

export function generateMathQuestion(diff: MathDifficulty): MathQuestion {
  const op = diff.ops[randomInt(0, diff.ops.length - 1)];

  switch (op) {
    case '+': {
      const a = randomInt(1, Math.max(1, diff.maxNumber - 1));
      const b = randomInt(1, Math.max(1, diff.maxNumber - a));
      return buildQuestion(a, b, '+', a + b);
    }
    case '-': {
      const a = randomInt(2, diff.maxNumber);
      const b = randomInt(1, a);
      return buildQuestion(a, b, '-', a - b);
    }
    case '×': {
      const a = randomInt(1, diff.multiplierMax);
      const b = randomInt(1, diff.multiplierMax);
      return buildQuestion(a, b, '×', a * b);
    }
    case '÷': {
      const b = randomInt(2, diff.multiplierMax);
      const quotient = randomInt(1, diff.multiplierMax);
      const a = b * quotient;
      return buildQuestion(a, b, '÷', quotient);
    }
  }
}

export function generateMathQuestionSet(
  diff: MathDifficulty,
  count: number = QUESTIONS_PER_LEVEL
): MathQuestion[] {
  return generateUniqueSet(
    () => generateMathQuestion(diff),
    (q) => `${q.op}:${q.a}:${q.b}`,
    count
  );
}

export function emojiRow(count: number): string {
  return '🍎'.repeat(count);
}
