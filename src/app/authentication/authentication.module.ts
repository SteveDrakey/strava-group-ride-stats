import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';
import { AthletesService } from '../api/api';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class AuthenticationModule {

  static accesstoken: string;

  public accesstoken: string;
  public scope: string;
  LoggedIn: BehaviorSubject<any>;

  constructor(
    private httpClient: HttpClient,
    private athletesService: AthletesService
  ) {
    this.LoggedIn = new BehaviorSubject<string>(null);
  }

  refreshToken: string;
  public currentAthlete: any;

  connectToStrava() {
    const params = {
      client_id: '15088',
      redirect_uri: `${location.origin}/`,
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
    AuthenticationModule.accesstoken  = null;
    this.accesstoken  = null;
    this.LoggedIn.next(null);
    this.currentAthlete = null;
  }

  async login() {

    this.refreshToken = localStorage.getItem('refresh_token');
    if (this.refreshToken) {
      // lets use it
      await this.refreshExpiredToken(this.refreshToken);
      return;
    }

  }
  async refreshExpiredToken(refreshToken: string) {
    const reply = await this.httpClient.post('/.netlify/functions/auth-refresh', refreshToken).toPromise<any>();
    console.log('refreshExpiredToken', reply);

    this.refreshToken = reply.refresh_token;
    this.accesstoken = reply.access_token;
    AuthenticationModule.accesstoken = reply.access_token;

    this.refreshToken = refreshToken;
    localStorage.setItem('refresh_token', refreshToken);
    localStorage.setItem('accesstoken', this.accesstoken);
    this.currentAthlete  = await this.athletesService.getLoggedInAthlete().toPromise();
    this.LoggedIn.next(this.currentAthlete);


  }

  async authorizeToken(code: string, scope: string) {

    const reply = await this.httpClient.get(`/.netlify/functions/auth-callback-get?code=${code}`).toPromise<any>();

    console.log('authorizeToken', reply);
    console.log('authorizeToken - refresh_token', reply.refresh_token);

    this.refreshToken = reply.refresh_token;
    this.accesstoken = reply.access_token;
    AuthenticationModule.accesstoken = reply.access_token;

    localStorage.setItem('refresh_token', this.refreshToken);
    localStorage.setItem('accesstoken', this.accesstoken);
    // this.currentAthlete  = await this.athletesService.getLoggedInAthlete().toPromise();
    this.LoggedIn.next(reply.athlete);
  }
}
