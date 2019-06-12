import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AthletesService } from '../api/athletes.service';
import { DetailedAthlete } from '../model/models';
import { AuthenticationService } from '../authentication.service';
import { GroupRideLeadersService, Leader, LeadTableEntry } from '../group-ride-leaders.service';
import { Observable, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { APP_BASE_HREF } from '@angular/common';

@Component({
  selector: 'app-connect-to-strava',
  templateUrl: './connect-to-strava.component.html',
  styleUrls: ['./connect-to-strava.component.scss']
})
export class ConnectToStravaComponent implements OnInit {
  code: string;
  leadboard: Leader[] = []; // = [ {name: 'test' } ];

  displayedColumns: string[] = ['grade', 'name', 'first', 'second', 'third'];
  displayedLeaderColumns: string[] = ['name', 'points'];

  upHillLeaders: LeadTableEntry[] = [];
  downHillLeaders: LeadTableEntry[] = [];

  constructor(
    private groupRideLeadersService: GroupRideLeadersService,
    private location: Location,
    public authentication: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private httpClient: HttpClient,
    protected athletesService: AthletesService) {

  }

  connectToStrava() {
    const params = {
      client_id: '15088',
      redirect_uri: `${location.origin}${location.pathname}`,
      response_type: 'code',
      approval_prompt: 'auto',
      scope: 'activity:read'
    };

    const url = 'https://www.strava.com/oauth/mobile/authorize';

    // tslint:disable-next-line: max-line-length
    const query = `client_id=${params.client_id}&redirect_uri=${params.redirect_uri}&response_type=${params.response_type}&approval_prompt=${params.approval_prompt}&scope=${params.scope}`;

    console.log(`${url}?${query}`);
    window.location.href = `${url}?${query}`;
  }
  Logout() {
    localStorage.clear();
    this.authentication.currentAthlete = null;
  }
  async ngOnInit() {
    // Snapshot is fine here, as we get sent here from strava
    const params: any = this.activatedRoute.snapshot.queryParams;
    this.code = params.code;

    if (this.code) {
      await this.authentication.authorizeToken(this.code);
    } else {
      // Can we just refresh the token?
      await this.authentication.login();
    }

    // this.leadboard = await this.groupRideLeadersService.LeadBoard(2426715456).toPromise<Leader[]>();
    if (AuthenticationService.accesstoken) {
      console.log('doing it');
      this.groupRideLeadersService.LeadBoard().subscribe((data) => {
        this.leadboard = data;
        this.upHillLeaders = this.groupRideLeadersService.UpHillLeaders(data);
        this.downHillLeaders = this.groupRideLeadersService.DownHillLeaders(data);
      }
      );
    }
  }
}
