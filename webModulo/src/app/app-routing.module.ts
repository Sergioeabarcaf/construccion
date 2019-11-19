import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { GraphComponent } from './pages/graph/graph.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'graph/:id/:param', component: GraphComponent},
  { path: '**', component: HomeComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
