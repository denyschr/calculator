import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { HistoryEntry } from '../types';

@Component({
  selector: 'app-calculator-history',
  templateUrl: './calculator-history.html',
  styleUrl: './calculator-history.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalculatorHistory {
  public readonly visible = input.required<boolean>();
  public readonly entries = input.required<HistoryEntry[]>();
}
