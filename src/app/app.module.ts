import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';

// tslint:disable-next-line: max-line-length
import { MatToolbarModule, MatButtonModule, MatSidenavModule, MatIconModule, MatListModule, MatGridListModule, MatCardModule, MatMenuModule, MatTableModule, MatPaginatorModule, MatSortModule } from '@angular/material';
import { NavComponent } from './nav/nav.component';

import { ActivitiesService } from './api/activities.service';
import { AthletesService } from './api/athletes.service';
import { ClubsService } from './api/clubs.service';
import { GearsService } from './api/gears.service';
import { RoutesService } from './api/routes.service';
import { RunningRacesService } from './api/runningRaces.service';
import { SegmentEffortsService } from './api/segmentEfforts.service';
import { SegmentsService } from './api/segments.service';
import { StreamsService } from './api/streams.service';
import { UploadsService } from './api/uploads.service';


import { ConnectToStravaComponent } from './connect-to-strava/connect-to-strava.component';
import { LastRideDetailsComponent } from './last-ride-details/last-ride-details.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    ConnectToStravaComponent,
    LastRideDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  providers: [
    ActivitiesService,
    AthletesService,
    ClubsService,
    GearsService,
    RoutesService,
    RunningRacesService,
    SegmentEffortsService,
    SegmentsService,
    StreamsService,
    UploadsService],
  bootstrap: [AppComponent]
})
export class AppModule { }
