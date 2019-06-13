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
import { FlexLayoutModule } from '@angular/flex-layout';

import { LastRideDetailsComponent } from './last-ride-details/last-ride-details.component';
import { HttpClientModule } from '@angular/common/http';
import { Configuration } from './configuration';
import { AuthenticationModule } from './authentication/authentication.module';
import { GroupRideStatsComponent } from './group-ride-stats/group-ride-stats.component';
import { ActivityRenamerComponent } from './activity-renamer/activity-renamer.component';

export function ConfigurationFactory(): Configuration {
  return new Configuration( { accessToken : () => {
    console.log('accesstoken', AuthenticationModule.accesstoken);
    return AuthenticationModule.accesstoken;
  }
});
}

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    GroupRideStatsComponent,
    LastRideDetailsComponent,
    ActivityRenamerComponent,
  ],
  imports: [

    FlexLayoutModule,
    HttpClientModule,
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
    MatSortModule,
    MatIconModule
  ],
  providers: [
    AuthenticationModule,
    ActivitiesService,
    AthletesService,
    ClubsService,
    GearsService,
    RoutesService,
    RunningRacesService,
    SegmentEffortsService,
    SegmentsService,
    StreamsService,
    UploadsService,
    {
      provide: Configuration, useValue: ConfigurationFactory()
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
