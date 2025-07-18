import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeStore {
  private readonly _darkMode = signal(localStorage.getItem('calculatorTheme') === 'dark');
  public readonly darkMode = this._darkMode.asReadonly();

  public toggle(): void {
    const newTheme = !this._darkMode();
    this._darkMode.set(newTheme);
    localStorage.setItem('calculatorTheme', newTheme ? 'dark' : 'light');
  }
}
