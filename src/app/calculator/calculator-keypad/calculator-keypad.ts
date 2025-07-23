import { ChangeDetectionStrategy, Component, output } from '@angular/core';

import { Digit, Operator } from '../types';

@Component({
  selector: 'qa-calculator-keypad',
  templateUrl: './calculator-keypad.html',
  styleUrl: './calculator-keypad.css',
  host: {
    '(document:keydown)': 'onKeyDown($event)'
  },
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalculatorKeypad {
  public readonly digitEntered = output<Digit>();
  public readonly operatorEntered = output<Operator>();
  public readonly dotEntered = output();
  public readonly equalsEntered = output();
  public readonly percentEntered = output();
  public readonly negativeSignEntered = output();
  public readonly cleared = output();
  public readonly deleted = output();

  protected onKeyDown(event: KeyboardEvent): void {
    if ((event.target as HTMLElement)?.tabIndex >= 0) {
      return;
    }

    const key = event.key;
    if (/^[0-9]$/.test(key)) {
      event.preventDefault();
      return void this.digitEntered.emit(key as Digit);
    }

    switch (key) {
      case '+':
        this.operatorEntered.emit('+');
        break;
      case '-':
        this.operatorEntered.emit('–');
        break;
      case '*':
        this.operatorEntered.emit('×');
        break;
      case '/':
        this.operatorEntered.emit('÷');
        break;
      case '.':
        this.dotEntered.emit();
        break;
      case '=':
      case 'Enter':
        this.equalsEntered.emit();
        break;
      case '%':
        this.percentEntered.emit();
        break;
      case 'F9':
        this.negativeSignEntered.emit();
        break;
      case 'Escape':
        this.cleared.emit();
        break;
      case 'Backspace':
        this.deleted.emit();
        break;
      default:
        return;
    }

    event.preventDefault();
  }
}
