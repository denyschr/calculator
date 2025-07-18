import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ThemeSwitcher } from './theme-switcher/theme-switcher';
import { ThemeStore } from './theme-switcher/theme-store';

@Component({
  selector: 'qa-calculator',
  templateUrl: './calculator.html',
  styleUrl: './calculator.css',
  imports: [ThemeSwitcher],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Calculator {
  protected readonly themeStore = inject(ThemeStore);
}
