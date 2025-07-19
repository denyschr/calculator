import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DoCheck,
  inject,
  signal
} from '@angular/core';

import { ThemeSwitcher } from './theme-switcher/theme-switcher';
import { ThemeStore } from './theme-switcher/theme-store';

type State = 'INITIAL' | 'LEFT_OPERAND' | 'OPERATOR' | 'RIGHT_OPERAND' | 'EQUALS';
type InputEvent = 'ZERO' | 'DIGIT' | 'DOT' | 'OPERATOR' | 'EQUALS';
type Digit = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type Operator = '+' | '–' | '×' | '÷';

@Component({
  selector: 'qa-calculator',
  templateUrl: './calculator.html',
  styleUrl: './calculator.css',
  imports: [ThemeSwitcher],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Calculator implements DoCheck {
  protected readonly themeStore = inject(ThemeStore);

  private currentState: State = 'INITIAL';

  protected readonly leftOperand = signal(0);
  protected readonly operator = signal<Operator | null>(null);
  protected readonly rightOperand = signal(0);
  protected readonly display = signal('0');

  protected readonly expression = computed(() => {
    const left = this.leftOperand();
    const operator = this.operator();
    const right = this.rightOperand();

    switch (this.currentState) {
      case 'OPERATOR':
        return `${left} ${operator}`;
      case 'EQUALS':
        return `${left} ${operator} ${right} =`;
      default:
        return '';
    }
  });

  public ngDoCheck(): void {
    console.log(`currentState: ${this.currentState}`);
    console.log(`leftOperand: ${this.leftOperand()}`);
    console.log(`operator: ${this.operator()}`);
    console.log(`rightOperand: ${this.rightOperand()}`);
    console.log(`display: ${this.display()}`);
  }

  protected enterDigit(digit: Digit): void {
    switch (this.currentState) {
      case 'INITIAL':
      case 'OPERATOR':
      case 'EQUALS':
        this.display.set(digit);
        break;
      case 'LEFT_OPERAND':
      case 'RIGHT_OPERAND':
        this.display.update((value) => value + digit);
        break;
    }
    this.updateState('DIGIT');
  }

  protected enterZero(): void {
    switch (this.currentState) {
      case 'LEFT_OPERAND':
      case 'RIGHT_OPERAND':
        this.display.update((value) => value + '0');
        break;
      case 'OPERATOR':
      case 'EQUALS':
        this.display.set('0');
        break;
    }
  }

  protected enterOperator(operator: Operator): void {
    switch (this.currentState) {
      case 'LEFT_OPERAND':
        this.leftOperand.set(Number(this.display()));
        this.operator.set(operator);
        break;
      case 'OPERATOR':
        this.operator.set(operator);
        break;
    }
    this.updateState('OPERATOR');
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
    this.currentState = 'INITIAL';
    this.leftOperand.set(0);
    this.operator.set(null);
    this.rightOperand.set(0);
    this.display.set('0');
  }

  private updateState(inputEvent: InputEvent): void {
    switch (this.currentState) {
      case 'INITIAL':
        if (inputEvent === 'DIGIT') {
          this.currentState = 'LEFT_OPERAND';
        }
        break;
      case 'LEFT_OPERAND':
        if (inputEvent === 'OPERATOR') {
          this.currentState = 'OPERATOR';
        }
        break;
      case 'OPERATOR':
        if (inputEvent === 'DIGIT') {
          this.currentState = 'RIGHT_OPERAND';
        }
        break;
      case 'RIGHT_OPERAND':
        break;
      case 'EQUALS':
        break;
    }
  }
}
