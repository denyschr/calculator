import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'qa-calculator',
  templateUrl: './calculator.html',
  styleUrl: './calculator.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Calculator {}
