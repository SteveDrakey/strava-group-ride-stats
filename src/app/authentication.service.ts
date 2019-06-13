// import { Injectable } from '@angular/core';
// import { HttpHeaders, HttpClient } from '@angular/common/http';
// import { AthletesService } from './api/athletes.service';
// import { ThrowStmt } from '@angular/compiler';
// import { AuthenticationModule } from './authentication/authentication.module';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthenticationService {
//   static accesstoken: string;

//   refreshToken: string;
//   public currentAthlete: any;

//   constructor(
//     private httpClient: HttpClient,
//     private athletesService: AuthenticationModule
//   ) { }


//   connectToStrava() {
//     const params = {
//       client_id: '15088',
//       redirect_uri: `${location.origin}${location.pathname}`,
//       response_type: 'code',
//       approval_prompt: 'auto',
//       scope: 'activity:read'
//     };

//     const url = 'https://www.strava.com/oauth/mobile/authorize';

//     // tslint:disable-next-line: max-line-length
//     const query = `client_id=${params.client_id}&redirect_uri=${params.redirect_uri}&response_type=${params.response_type}&approval_prompt=${params.approval_prompt}&scope=${params.scope}`;

//     console.log(`${url}?${query}`);
//     window.location.href = `${url}?${query}`;
//   }

//   Logout() {
//     localStorage.clear();
//     this.currentAthlete = null;
//   }


//   async login() {

//     this.refreshToken = localStorage.getItem('refresh_token');
//     console.log('refresh Token', this.refreshToken);
//     if (this.refreshToken) {
//       // lets use it
//       await this.refreshExpiredToken(this.refreshToken);
//       return;
//     }

//   }
//   async refreshExpiredToken(refreshToken: string) {
//     console.log('refreshExpiredToken');
//     const options = {
//       headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
//     };

//     const data = new URLSearchParams();

//     data.set('client_id', '15088');
//     data.set('client_secret', '***REMOVED***');
//     data.set('refresh_token', refreshToken);
//     data.set('grant_type', 'refresh_token');

//     const reply = await this.httpClient.post('https://www.strava.com/oauth/token', data.toString(), options).toPromise<any>();

//     this.refreshToken = reply.refresh_token;
//     AuthenticationService.accesstoken = reply.access_token;
//     localStorage.setItem('accesstoken', AuthenticationService.accesstoken);

//     this.athletesService.configuration.accessToken = reply.access_token;
//     this.currentAthlete  = await this.athletesService.getLoggedInAthlete().toPromise();
//     console.log('currentAthlete (refresh)', this.currentAthlete);
//   }

//   async authorizeToken(code: string) {
//     console.log('authorizeToken');
//     const options = {
//       headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
//     };

//     const data = new URLSearchParams();

//     data.set('client_id', '15088');
//     data.set('client_secret', '***REMOVED***');
//     data.set('code', code);
//     data.set('grant_type', 'authorization_code');

//     const reply = await this.httpClient.post('https://www.strava.com/api/v3/oauth/token', data.toString(), options).toPromise<any>();

//     this.refreshToken = reply.refresh_token;
//     AuthenticationService.accesstoken = reply.access_token;
//     localStorage.setItem('refresh_token', this.refreshToken);
//     localStorage.setItem('accesstoken', AuthenticationService.accesstoken);

//     this.athletesService.configuration.accessToken = reply.access_token;
//     this.currentAthlete  = await this.athletesService.getLoggedInAthlete().toPromise();
//     console.log('currentAthlete', this.currentAthlete);
//   }



// }
