import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConnectToStravaComponent } from './connect-to-strava/connect-to-strava.component';

const routes: Routes = [
  { path: 'home', component: ConnectToStravaComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
