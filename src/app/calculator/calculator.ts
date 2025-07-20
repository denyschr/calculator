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
type InputEvent = 'DIGIT' | 'DOT' | 'OPERATOR' | 'EQUALS';
type Digit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
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

  protected readonly currentState = signal<State>('INITIAL');
  protected readonly leftOperand = signal(0);
  protected readonly operator = signal<Operator | null>(null);
  protected readonly rightOperand = signal(0);
  protected readonly display = signal('0');
  protected readonly hasDot = signal(false);

  protected readonly expression = computed(() => {
    const left = this.leftOperand();
    const operator = this.operator();
    const right = this.rightOperand();

    switch (this.currentState()) {
      case 'OPERATOR':
      case 'RIGHT_OPERAND':
        return `${left} ${operator}`;
      case 'EQUALS':
        return `${left} ${operator} ${right} =`;
      default:
        return '';
    }
  });

  public ngDoCheck(): void {
    console.log(`currentState: ${this.currentState()}`);
    console.log(`leftOperand: ${this.leftOperand()}`);
    console.log(`operator: ${this.operator()}`);
    console.log(`rightOperand: ${this.rightOperand()}`);
    console.log(`display: ${this.display()}`);
    console.log(`hasDot: ${this.hasDot()}`);
  }

  protected enterDigit(digit: Digit): void {
    switch (this.currentState()) {
      case 'INITIAL':
      case 'OPERATOR':
      case 'EQUALS':
        this.display.set(digit);
        break;
      case 'LEFT_OPERAND':
      case 'RIGHT_OPERAND':
        if (this.display() !== '0') {
          this.display.update((value) => value + digit);
        } else {
          this.display.set(digit);
        }
        break;
    }
    this.updateState('DIGIT');
  }

  protected enterOperator(operator: Operator): void {
    switch (this.currentState()) {
      case 'LEFT_OPERAND':
      case 'EQUALS':
        this.leftOperand.set(parseFloat(this.display()));
        this.display.set(String(this.leftOperand()));
        this.operator.set(operator);
        break;
      case 'RIGHT_OPERAND':
        this.rightOperand.set(parseFloat(this.display()));
        const result = this.calculate();
        this.display.set(String(result));
        this.leftOperand.set(result);
        this.operator.set(operator);
        break;
      case 'OPERATOR':
        this.operator.set(operator);
        break;
    }
    this.hasDot.set(false);
    this.updateState('OPERATOR');
  }

  protected enterEquals(): void {
    if (this.currentState() === 'RIGHT_OPERAND') {
      this.rightOperand.set(parseFloat(this.display()));
      const result = this.calculate();
      this.display.set(String(result));
      this.hasDot.set(false);
      this.updateState('EQUALS');
    }
  }

  protected enterDot(): void {
    switch (this.currentState()) {
      case 'INITIAL':
      case 'OPERATOR':
      case 'EQUALS':
        this.hasDot.set(true);
        this.display.set('0.');
        break;
      case 'LEFT_OPERAND':
      case 'RIGHT_OPERAND':
        if (!this.hasDot()) {
          this.hasDot.set(true);
          this.display.update((value) => value + '.');
        }
        break;
    }
    this.updateState('DOT');
  }

  protected enterPercent(): void {
    // ...
  }

  protected clear(): void {
    this.currentState.set('INITIAL');
    this.leftOperand.set(0);
    this.operator.set(null);
    this.rightOperand.set(0);
    this.display.set('0');
    this.hasDot.set(false);
  }

  private calculate(): number {
    const left = this.leftOperand();
    const right = this.rightOperand();

    if (Number.isNaN(left) || Number.isNaN(right)) {
      throw new Error('Invalid operand');
    }

    switch (this.operator()) {
      case '+':
        return left + right;
      case '–':
        return left - right;
      case '×':
        return left * right;
      case '÷':
        return left / right;
      default:
        throw new Error('Invalid operator');
    }
  }

  private updateState(inputEvent: InputEvent): void {
    switch (this.currentState()) {
      case 'INITIAL':
        if (inputEvent === 'DIGIT' || inputEvent === 'DOT') {
          this.currentState.set('LEFT_OPERAND');
        }
        break;
      case 'LEFT_OPERAND':
        if (inputEvent === 'OPERATOR') {
          this.currentState.set('OPERATOR');
        }
        break;
      case 'OPERATOR':
        if (inputEvent === 'DIGIT' || inputEvent === 'DOT') {
          this.currentState.set('RIGHT_OPERAND');
        }
        break;
      case 'RIGHT_OPERAND':
        if (inputEvent === 'OPERATOR') {
          this.currentState.set('OPERATOR');
        } else if (inputEvent === 'EQUALS') {
          this.currentState.set('EQUALS');
        }
        break;
      case 'EQUALS':
        if (inputEvent === 'DIGIT' || inputEvent === 'DOT') {
          this.currentState.set('LEFT_OPERAND');
        } else if (inputEvent === 'OPERATOR') {
          this.currentState.set('OPERATOR');
        }
        break;
    }
  }
}
