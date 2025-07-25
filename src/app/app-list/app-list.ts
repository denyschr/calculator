import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'qa-app-list',
  templateUrl: './app-list.html',
  styleUrl: './app-list.css',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppList {}
