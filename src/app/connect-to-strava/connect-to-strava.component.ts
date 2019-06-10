import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AthletesService } from '../api/athletes.service';
import { DetailedAthlete } from '../model/models';
import { AuthenticationService } from '../authentication.service';

@Component({
  selector: 'app-connect-to-strava',
  templateUrl: './connect-to-strava.component.html',
  styleUrls: ['./connect-to-strava.component.scss']
})
export class ConnectToStravaComponent implements OnInit {
  code: string;
  constructor(private location: Location,
              private authentication: AuthenticationService,
              private activatedRoute: ActivatedRoute,
              private httpClient: HttpClient,
              protected athletesService: AthletesService ) {
    console.log('ConnectToStravaComponent loaded');

  }

  connectToStrava() {
    const params = {
      client_id: '15088',
      redirect_uri: 'http://localhost:4200/home',
      response_type: 'code',
      approval_prompt: 'auto',
      scope: 'activity:read'
    };

    const url = 'https://www.strava.com/oauth/authorize';

    // tslint:disable-next-line: max-line-length
    const query = `client_id=${params.client_id}&redirect_uri=${params.redirect_uri}&response_type=${params.response_type}&approval_prompt=${params.approval_prompt}&scope=${params.scope}`;

    console.log(`${url}?${query}`);
    window.location.href = `${url}?${query}`;
  }

  async ngOnInit() {
    // Snapshot is fine here, as we get sent here from strava
    const params: any = this.activatedRoute.snapshot.queryParams ;
    this.code = params.code;

    if (this.code) {
      await this.authentication.authorizeToken(this.code);
      this.location.go('/home');
      return;
    }

    // Can we just refresh the token?
    await this.authentication.login();

 //   console.log('init', this.authentication.currentAthlete);

  }
}
