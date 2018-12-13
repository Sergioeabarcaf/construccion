import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NewComponent } from './pages/new/new.component';
import { LiveComponent } from './pages/live/live.component';
import { InitComponent } from './pages/init/init.component';
import { SessionComponent } from './pages/session/session.component';
import { SessionsComponent } from './pages/sessions/sessions.component';
import { AuthGuardService } from './providers/auth-guard.service';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  {
    path: 'new',
    component: NewComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'live',
    component: LiveComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'init',
    component: InitComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'sessions',
    component: SessionsComponent,
    canActivate: [ AuthGuardService ]
  },
  {
    path: 'session/:id',
    component: SessionComponent,
    canActivate: [ AuthGuardService ]
  },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
