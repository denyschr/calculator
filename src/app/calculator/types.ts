export type CalculatorState = 'INITIAL' | 'LEFT_OPERAND' | 'OPERATOR' | 'RIGHT_OPERAND' | 'EQUALS';

export type CalculatorEvent = 'DIGIT' | 'DOT' | 'PERCENT' | 'NEGATIVE_SIGN' | 'OPERATOR' | 'EQUALS';

export type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type Operator = '+' | '–' | '×' | '÷';

export type HistoryEntry = {
  id: number;
  expression: string;
  result: string;
};
