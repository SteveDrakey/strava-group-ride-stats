import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupRideStatsComponent } from './group-ride-stats/group-ride-stats.component';
import { ActivityRenamerComponent } from './activity-renamer/activity-renamer.component';
import { FreeSearchComponent } from './free-search/free-search.component';

const routes: Routes = [
  { path: 'GroupRides', component: GroupRideStatsComponent},
  { path: 'Renamer', component: ActivityRenamerComponent},
  { path: 'Search', component: FreeSearchComponent},
  { path: '', component: GroupRideStatsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
