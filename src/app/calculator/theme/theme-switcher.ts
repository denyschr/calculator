import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { ThemeStore } from './theme-store';

@Component({
  selector: 'app-theme-switcher',
  templateUrl: './theme-switcher.html',
  styleUrl: './theme-switcher.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeSwitcher {
  protected readonly themeStore = inject(ThemeStore);
}
