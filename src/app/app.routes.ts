import { Routes } from '@angular/router';
import { DiscoverComponent } from './features/discover/discover.component';
import { AuthComponent } from './features/auth/auth.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';

export const routes: Routes = [
  { path: '', redirectTo: 'discover', pathMatch: 'full' },
  { path: 'discover', component: DiscoverComponent },
  { path: 'auth', component: AuthComponent },
  { path: 'dashboard', component: DashboardComponent }
];