import { Routes } from '@angular/router';
import { EditTeamComponent } from './edit-team/edit-team.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { HomePageComponent } from './home-page/home-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomePageComponent,
  },
  { path: 'edit-team', component: EditTeamComponent },
  { path: '**', component: ErrorPageComponent },
];
