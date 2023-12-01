import { Routes } from '@angular/router';
import { AccountDashboardComponent } from '../components/private/dashboard.component';

export const DashboardRoutes: Routes = [
  {
    path: 'dashboard',
    component: AccountDashboardComponent,
  },
];
