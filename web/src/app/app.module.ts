import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { InitComponent } from './pages/init/init.component';
import { NewComponent } from './pages/new/new.component';
import { LiveComponent } from './pages/live/live.component';
import { SessionComponent } from './pages/session/session.component';
import { NavbarComponent } from './pages/shared/navbar/navbar.component';
import { FooterComponent } from './pages/shared/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InitComponent,
    NewComponent,
    LiveComponent,
    SessionComponent,
    NavbarComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
