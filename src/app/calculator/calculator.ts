import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { ThemeStore } from './theme/theme-store';
import { CalculatorHistory } from './calculator-history/calculator-history';
import { CalculatorEvent, CalculatorState, Digit, HistoryEntry, Operator } from './types';
import { CalculatorKeypad } from './calculator-keypad/calculator-keypad';
import { CalculatorScreen } from './calculator-screen/calculator-screen';
import { CalculatorTopbar } from './calculator-topbar/calculator-topbar';

@Component({
  selector: 'qa-calculator',
  templateUrl: './calculator.html',
  styleUrl: './calculator.css',
  imports: [CalculatorHistory, CalculatorKeypad, CalculatorScreen, CalculatorTopbar],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Calculator {
  protected readonly themeStore = inject(ThemeStore);

  protected readonly currentState = signal<CalculatorState>('INITIAL');
  protected readonly leftOperand = signal(0);
  protected readonly operator = signal<Operator | null>(null);
  protected readonly rightOperand = signal(0);
  protected readonly display = signal('0');
  protected readonly history = signal<HistoryEntry[]>([]);
  protected readonly historyVisible = signal(false);

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

  protected toggleHistory(): void {
    this.historyVisible.update((visible) => !visible);
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
          this.display.update((operand) => operand + digit);
        } else {
          this.display.set(digit);
        }
        break;
    }
    this.updateState('DIGIT');
  }

  protected enterOperator(operator: Operator): void {
    switch (this.currentState()) {
      case 'INITIAL':
      case 'LEFT_OPERAND':
      case 'EQUALS':
        this.leftOperand.set(parseFloat(this.display()));
        this.display.set(String(this.leftOperand()));
        break;
      case 'RIGHT_OPERAND':
        this.rightOperand.set(parseFloat(this.display()));
        const result = this.evaluate();
        this.display.set(String(result));
        this.addToHistory();
        this.leftOperand.set(result);
        break;
    }
    this.operator.set(operator);
    this.updateState('OPERATOR');
  }

  protected enterEquals(): void {
    if (this.currentState() === 'RIGHT_OPERAND') {
      this.rightOperand.set(parseFloat(this.display()));
      const result = this.evaluate();
      this.display.set(String(result));
      this.addToHistory();
      this.updateState('EQUALS');
    }
  }

  protected enterDot(): void {
    switch (this.currentState()) {
      case 'INITIAL':
      case 'OPERATOR':
      case 'EQUALS':
        this.display.set('0.');
        break;
      case 'LEFT_OPERAND':
      case 'RIGHT_OPERAND':
        if (!this.display().includes('.')) {
          this.display.update((operand) => operand + '.');
        }
        break;
    }
    this.updateState('DOT');
  }

  protected enterPercent(): void {
    switch (this.currentState()) {
      case 'INITIAL':
      case 'LEFT_OPERAND':
      case 'EQUALS':
        this.display.set(String(parseFloat(this.display()) / 100));
        break;
      case 'RIGHT_OPERAND':
        const result = this.percentage();
        this.display.set(String(result));
        break;
    }
    this.updateState('PERCENT');
  }

  protected enterNegativeSign(): void {
    switch (this.currentState()) {
      case 'INITIAL':
      case 'LEFT_OPERAND':
      case 'RIGHT_OPERAND':
      case 'EQUALS':
        this.display.update((operand) => String(-1 * parseFloat(operand)));
        break;
    }
    this.updateState('NEGATIVE_SIGN');
  }

  protected deleteEntry(): void {
    switch (this.currentState()) {
      case 'INITIAL':
      case 'LEFT_OPERAND':
      case 'RIGHT_OPERAND':
        const current = this.display();
        if (current === '0') {
          return;
        }
        if (current.length === 1 || (current.length === 2 && current.startsWith('-'))) {
          this.display.set('0');
        } else if (current.length > 1) {
          this.display.update((operand) => operand.slice(0, -1));
        }
        break;
    }
  }

  protected clear(): void {
    this.currentState.set('INITIAL');
    this.leftOperand.set(0);
    this.operator.set(null);
    this.rightOperand.set(0);
    this.display.set('0');
  }

  private percentage(): number {
    const left = this.leftOperand();
    const current = parseFloat(this.display());

    switch (this.operator()) {
      case '+':
      case '–':
        return (left * current) / 100;
      case '×':
      case '÷':
      default:
        return current / 100;
    }
  }

  private evaluate(): number {
    const left = this.leftOperand();
    const right = this.rightOperand();

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

  private addToHistory(): void {
    const entry = {
      id: Date.now(),
      expression: `${this.leftOperand()} ${this.operator()} ${this.rightOperand()} =`,
      result: this.display()
    };
    this.history.update((entries) => [entry, ...entries]);
  }

  private updateState(event: CalculatorEvent): void {
    switch (this.currentState()) {
      case 'INITIAL':
        if (event === 'DIGIT' || event === 'DOT') {
          this.currentState.set('LEFT_OPERAND');
        } else if (event === 'OPERATOR') {
          this.currentState.set('OPERATOR');
        }
        break;
      case 'LEFT_OPERAND':
        if (event === 'OPERATOR') {
          this.currentState.set('OPERATOR');
        }
        break;
      case 'OPERATOR':
        if (event === 'DIGIT' || event === 'DOT') {
          this.currentState.set('RIGHT_OPERAND');
        }
        break;
      case 'RIGHT_OPERAND':
        if (event === 'OPERATOR') {
          this.currentState.set('OPERATOR');
        } else if (event === 'EQUALS') {
          this.currentState.set('EQUALS');
        }
        break;
      case 'EQUALS':
        if (event === 'DIGIT' || event === 'DOT') {
          this.currentState.set('LEFT_OPERAND');
        } else if (event === 'OPERATOR') {
          this.currentState.set('OPERATOR');
        } else if (event === 'PERCENT' || event === 'NEGATIVE_SIGN') {
          this.currentState.set('INITIAL');
        }
        break;
    }
  }
}
