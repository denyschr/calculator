import { Component } from '@angular/core';

import Calculator from './calculator/calculator';

// eslint-disable-next-line @angular-eslint/prefer-on-push-component-change-detection
@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [Calculator]
})
export class App {}
