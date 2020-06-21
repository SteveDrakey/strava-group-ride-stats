import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LayoutModule } from '@angular/cdk/layout';

// tslint:disable-next-line: max-line-length
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavComponent } from './nav/nav.component';
import {MatChipsModule} from '@angular/material/chips';

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
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { FreeSearchComponent } from './free-search/free-search.component';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeHtmlPipe } from './safe-html.pipe';
import { MatLineModule } from '@angular/material/core';
import { SpacePipe } from './space.pipe';
import { DelimiterPipe } from './delimiter.pipe';
import { JoinPipe } from './join.pipe';


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
    FreeSearchComponent,
    SafeHtmlPipe,
    SpacePipe,
    DelimiterPipe,
    JoinPipe,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
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
    MatIconModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatLineModule,
    MatChipsModule,
    MatAutocompleteModule

  ],
  exports: [
    MatChipsModule
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
