import { Route } from '@angular/router';

import { AppList } from './app-list/app-list';

export const APP_ROUTES: Route[] = [
  {
    path: '',
    component: AppList
  },
  {
    path: 'calculator',
    loadComponent: () => import('./calculator/calculator')
  }
];
