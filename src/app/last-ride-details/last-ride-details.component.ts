import { Component, OnInit } from '@angular/core';
declare var require: any;



@Component({
  selector: 'app-last-ride-details',
  templateUrl: './last-ride-details.component.html',
  styleUrls: ['./last-ride-details.component.scss']
})
export class LastRideDetailsComponent implements OnInit {

  token = '6dff6d721867cbe5be5dbcd80124842601d681ad';

  constructor() {

    const StravaApiV3: any =  require('strava-v3');
//     const defaultClient = StravaApiV3.ApiClient.instance;

//     // Configure OAuth2 access token for authorization: strava_oauth
// // tslint:disable-next-line: variable-name
//     const strava_oauth = defaultClient.authentications.strava_oauth;
//     strava_oauth.accessToken = this.token;

//     const api = new StravaApiV3.SegmentsApi();

//     const opts = {
//       page: 56, // {Integer} Page number.
//       perPage: 56 // {Integer} Number of items per page. Defaults to 30.
//     };

//     const callback = function(error, data, response) {
//       if (error) {
//         console.error(error);
//       } else {
//         console.log('API called successfully. Returned data: ' + data);
//       }
//     };
//     api.getLoggedInAthleteStarredSegments(opts, callback);


  }

  ngOnInit() {
  }

}
