import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-calculator-screen',
  templateUrl: './calculator-screen.html',
  styleUrl: './calculator-screen.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalculatorScreen {
  public readonly expression = input.required<string>();
  public readonly result = input.required<string>();
}
