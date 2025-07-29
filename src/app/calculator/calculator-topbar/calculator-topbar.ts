import { ChangeDetectionStrategy, Component, output } from '@angular/core';

import { ThemeSwitcher } from '../theme/theme-switcher';

@Component({
  selector: 'app-calculator-topbar',
  templateUrl: './calculator-topbar.html',
  styleUrl: './calculator-topbar.css',
  imports: [ThemeSwitcher],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalculatorTopbar {
  public readonly historyToggled = output();
}
