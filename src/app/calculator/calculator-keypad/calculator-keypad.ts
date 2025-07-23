import { ChangeDetectionStrategy, Component, output } from '@angular/core';

import { Digit, Operator } from '../types';

@Component({
  selector: 'qa-calculator-keypad',
  templateUrl: './calculator-keypad.html',
  styleUrl: './calculator-keypad.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalculatorKeypad {
  public readonly digitEntered = output<Digit>();
  public readonly operatorEntered = output<Operator>();
  public readonly dotEntered = output();
  public readonly percentEntered = output();
  public readonly negativeSignEntered = output();
  public readonly equalsEntered = output();
  public readonly cleared = output();
  public readonly deleted = output();
}
