import { Routes } from '@angular/router';
import { EditTeamComponent } from './edit-team/edit-team.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { TransferTeamComponent } from './transfer-team/transfer-team.component';
import { TeamResolver } from './services/team-resolver.resolver';
import { MainLayoutComponent } from './main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    resolve: {
      teamData: TeamResolver,
    },
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: HomePageComponent,
      },
      {
        path: 'transfer',
        component: TransferTeamComponent,
      },
      {
        path: 'edit',
        component: EditTeamComponent,
      },
    ],
  },
  {
    path: '**',
    component: ErrorPageComponent,
  },
];
