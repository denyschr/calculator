import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { Calculator } from './calculator/calculator';

@Component({
  selector: 'qa-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [Calculator],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  protected readonly title = signal('quick-apps');
}
