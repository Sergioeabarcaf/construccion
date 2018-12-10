import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NewComponent } from './pages/new/new.component';
import { LiveComponent } from './pages/live/live.component';
import { InitComponent } from './pages/init/init.component';
import { SessionComponent } from './pages/session/session.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'new', component: NewComponent },
  { path: 'live', component: LiveComponent },
  { path: 'init', component: InitComponent },
  { path: 'session/:id', component: SessionComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
