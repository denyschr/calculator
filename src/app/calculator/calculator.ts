import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { ThemeSwitcher } from './theme-switcher/theme-switcher';
import { ThemeStore } from './theme-switcher/theme-store';

type State = (typeof STATES)[keyof typeof STATES];
type InputEvent = (typeof INPUT_EVENTS)[keyof typeof INPUT_EVENTS];
type Digit = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type Operator = '+' | '-' | '*' | '/';

const STATES = {
  INITIAL: 0,
  LEFT_OPERAND: 1,
  OPERATOR: 2,
  RIGHT_OPERAND: 3,
  EQUALS: 4
} as const;

const INPUT_EVENTS = {
  ZERO: 0,
  DIGIT: 1,
  DOT: 2,
  OPERATOR: 3,
  EQUALS: 4
} as const;

@Component({
  selector: 'qa-calculator',
  templateUrl: './calculator.html',
  styleUrl: './calculator.css',
  imports: [ThemeSwitcher],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Calculator {
  protected readonly themeStore = inject(ThemeStore);

  private currentState: State = STATES.INITIAL;

  protected readonly leftOperand = signal(0);
  protected readonly operator = signal<Operator | null>(null);
  protected readonly rightOperand = signal(0);
  protected readonly display = signal('0');

  protected enterDigit(digit: Digit): void {
    switch (this.currentState) {
      case STATES.INITIAL:
      case STATES.OPERATOR:
      case STATES.EQUALS:
        this.display.set(digit);
        break;
      case STATES.LEFT_OPERAND:
      case STATES.RIGHT_OPERAND:
        this.display.update((value) => value + digit);
        break;
    }
    this.updateState(INPUT_EVENTS.DIGIT);
  }

  protected enterZero(): void {
    switch (this.currentState) {
      case STATES.LEFT_OPERAND:
      case STATES.RIGHT_OPERAND:
        this.display.update((value) => value + '0');
        break;
      case STATES.OPERATOR:
      case STATES.EQUALS:
        this.display.set('0');
        break;
    }
  }

  protected enterOperator(operator: Operator): void {
    // ...
  }

  protected enterEquals(): void {
    // ...
  }

  protected enterDot(): void {
    // ...
  }

  protected enterPercent(): void {
    // ...
  }

  protected clear(): void {
    this.currentState = STATES.INITIAL;
    this.leftOperand.set(0);
    this.operator.set(null);
    this.rightOperand.set(0);
    this.display.set('0');
  }

  private updateState(inputEvent: InputEvent): void {
    switch (this.currentState) {
      case STATES.INITIAL:
        if (inputEvent === INPUT_EVENTS.DIGIT) {
          this.currentState = STATES.LEFT_OPERAND;
        }
        break;
      case STATES.LEFT_OPERAND:
        break;
      case STATES.OPERATOR:
        break;
      case STATES.RIGHT_OPERAND:
        break;
      case STATES.EQUALS:
        break;
    }
  }
}
