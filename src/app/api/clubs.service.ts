/**
 * Strava API v3
 * Strava API
 *
 * OpenAPI spec version: 3.0.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
/* tslint:disable:no-unused-variable member-ordering */

import { Inject, Injectable, Optional }                      from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,
         HttpResponse, HttpEvent }                           from '@angular/common/http';
import { CustomHttpUrlEncodingCodec }                        from '../encoder';

import { Observable }                                        from 'rxjs/Observable';

import { DetailedClub } from '../model/detailedClub';
import { Fault } from '../model/fault';
import { SummaryActivity } from '../model/summaryActivity';
import { SummaryAthlete } from '../model/summaryAthlete';
import { SummaryClub } from '../model/summaryClub';

import { BASE_PATH, COLLECTION_FORMATS }                     from '../variables';
import { Configuration }                                     from '../configuration';


@Injectable()
export class ClubsService {

    protected basePath = 'https://www.strava.com/api/v3';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional()@Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        for (const consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }


    /**
     * List Club Activities
     * Retrieve recent activities from members of a specific club. The authenticated athlete must belong to the requested club in order to hit this endpoint. Pagination is supported. Athlete profile visibility is respected for all activities.
     * @param id The identifier of the club.
     * @param page Page number.
     * @param perPage Number of items per page. Defaults to 30.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getClubActivitiesById(id: number, page?: number, perPage?: number, observe?: 'body', reportProgress?: boolean): Observable<Array<SummaryActivity>>;
    public getClubActivitiesById(id: number, page?: number, perPage?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<SummaryActivity>>>;
    public getClubActivitiesById(id: number, page?: number, perPage?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<SummaryActivity>>>;
    public getClubActivitiesById(id: number, page?: number, perPage?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getClubActivitiesById.');
        }



        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (page !== undefined && page !== null) {
            queryParameters = queryParameters.set('page', <any>page);
        }
        if (perPage !== undefined && perPage !== null) {
            queryParameters = queryParameters.set('per_page', <any>perPage);
        }

        let headers = this.defaultHeaders;

        // authentication (strava_oauth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.get<Array<SummaryActivity>>(`${this.basePath}/clubs/${encodeURIComponent(String(id))}/activities`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * List Club Administrators.
     * Returns a list of the administrators of a given club.
     * @param id The identifier of the club.
     * @param page Page number.
     * @param perPage Number of items per page. Defaults to 30.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getClubAdminsById(id: number, page?: number, perPage?: number, observe?: 'body', reportProgress?: boolean): Observable<Array<SummaryAthlete>>;
    public getClubAdminsById(id: number, page?: number, perPage?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<SummaryAthlete>>>;
    public getClubAdminsById(id: number, page?: number, perPage?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<SummaryAthlete>>>;
    public getClubAdminsById(id: number, page?: number, perPage?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getClubAdminsById.');
        }



        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (page !== undefined && page !== null) {
            queryParameters = queryParameters.set('page', <any>page);
        }
        if (perPage !== undefined && perPage !== null) {
            queryParameters = queryParameters.set('per_page', <any>perPage);
        }

        let headers = this.defaultHeaders;

        // authentication (strava_oauth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.get<Array<SummaryAthlete>>(`${this.basePath}/clubs/${encodeURIComponent(String(id))}/admins`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get Club
     * Returns a given club using its identifier.
     * @param id The identifier of the club.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getClubById(id: number, observe?: 'body', reportProgress?: boolean): Observable<DetailedClub>;
    public getClubById(id: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<DetailedClub>>;
    public getClubById(id: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<DetailedClub>>;
    public getClubById(id: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getClubById.');
        }

        let headers = this.defaultHeaders;

        // authentication (strava_oauth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.get<DetailedClub>(`${this.basePath}/clubs/${encodeURIComponent(String(id))}`,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * List Club Members
     * Returns a list of the athletes who are members of a given club.
     * @param id The identifier of the club.
     * @param page Page number.
     * @param perPage Number of items per page. Defaults to 30.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getClubMembersById(id: number, page?: number, perPage?: number, observe?: 'body', reportProgress?: boolean): Observable<Array<SummaryAthlete>>;
    public getClubMembersById(id: number, page?: number, perPage?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<SummaryAthlete>>>;
    public getClubMembersById(id: number, page?: number, perPage?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<SummaryAthlete>>>;
    public getClubMembersById(id: number, page?: number, perPage?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {

        if (id === null || id === undefined) {
            throw new Error('Required parameter id was null or undefined when calling getClubMembersById.');
        }



        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (page !== undefined && page !== null) {
            queryParameters = queryParameters.set('page', <any>page);
        }
        if (perPage !== undefined && perPage !== null) {
            queryParameters = queryParameters.set('per_page', <any>perPage);
        }

        let headers = this.defaultHeaders;

        // authentication (strava_oauth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.get<Array<SummaryAthlete>>(`${this.basePath}/clubs/${encodeURIComponent(String(id))}/members`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * List Athlete Clubs
     * Returns a list of the clubs whose membership includes the authenticated athlete.
     * @param page Page number.
     * @param perPage Number of items per page. Defaults to 30.
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getLoggedInAthleteClubs(page?: number, perPage?: number, observe?: 'body', reportProgress?: boolean): Observable<Array<SummaryClub>>;
    public getLoggedInAthleteClubs(page?: number, perPage?: number, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<Array<SummaryClub>>>;
    public getLoggedInAthleteClubs(page?: number, perPage?: number, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<Array<SummaryClub>>>;
    public getLoggedInAthleteClubs(page?: number, perPage?: number, observe: any = 'body', reportProgress: boolean = false ): Observable<any> {



        let queryParameters = new HttpParams({encoder: new CustomHttpUrlEncodingCodec()});
        if (page !== undefined && page !== null) {
            queryParameters = queryParameters.set('page', <any>page);
        }
        if (perPage !== undefined && perPage !== null) {
            queryParameters = queryParameters.set('per_page', <any>perPage);
        }

        let headers = this.defaultHeaders;

        // authentication (strava_oauth) required
        if (this.configuration.accessToken) {
            const accessToken = typeof this.configuration.accessToken === 'function'
                ? this.configuration.accessToken()
                : this.configuration.accessToken;
            headers = headers.set('Authorization', 'Bearer ' + accessToken);
        }

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
        ];

        return this.httpClient.get<Array<SummaryClub>>(`${this.basePath}/athlete/clubs`,
            {
                params: queryParameters,
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
