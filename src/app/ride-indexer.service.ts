import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { DexieService } from './dexie.service';
import { ActivitiesService, SegmentsService } from './api/api';
import { flatten } from '@angular/compiler';
import { Observable, observable, combineLatest, forkJoin, from, Subscriber, concat, BehaviorSubject, of } from 'rxjs';
import { DetailedActivity, SummaryActivity } from './model/models';
import { map, mergeMap, delay } from 'rxjs/operators';
import {
  SearchClient,
  SearchIndexClient,
  SearchIndexerClient,
  AzureKeyCredential
} from '@azure/search-documents';
import { HttpClient } from '@angular/common/http';
import { AuthenticationModule } from './authentication/authentication.module';

export interface Activity {
  activity: number;
  title: string;
  description: string;
  when: Date;
  score?: number;
  highlights?: any;
  map?: Observable<string>;
}

export interface ActivityKeywords {
  // id: number;
  activity: number;
  word: string;
}

@Injectable({
  providedIn: 'root'
})
export class RideIndexerService {

  activities: Dexie.Table<Activity, number>;
  activityKeywords: Dexie.Table<ActivityKeywords, number>;

  OnIndexedSubject$: BehaviorSubject<string>;
  OnIndexed$: Observable<string>;
  OnRequestStop$ = new BehaviorSubject<boolean>(false);
  keepRunning: boolean;

  public Facets$: Observable<any>;
  private FacetsSubject$ = new BehaviorSubject<any>(false);
  client: SearchClient<any>;

  constructor(
    private dexieService: DexieService,
    protected activitiesService: ActivitiesService, protected segmentsService: SegmentsService,
    private httpClient: HttpClient
  ) {
    this.activities = this.dexieService.table('activities');
    this.activityKeywords = this.dexieService.table('activityKeywords');

    this.OnIndexedSubject$ = new BehaviorSubject<string>('');
    this.OnIndexed$ = this.OnIndexedSubject$.asObservable();

    this.Facets$ = this.FacetsSubject$.asObservable();

    this.client = new SearchClient<any>(
      'https://search-strava.search.windows.net',
      'activities',
      new AzureKeyCredential('A77A8A928D5B9FED811EA2EA24C3992C')
    );
  }



  async index(page: number): Promise<number> {
    const activities = await this.activitiesService.getLoggedInAthleteActivities(null, null, page, 30).toPromise();
    for (const activitySummary of activities.slice(1, 100)) {
      try {
        if (!this.keepRunning) { return 0; }

        // const doc =  await this.client.getDocument(activitySummary.id.toString());

        try {
          const doc =  await this.client.getDocument(activitySummary.id.toString());
          console.log('skipping', activitySummary.id);
          if (doc) { continue; }
        } catch {

        }
        console.log('indexing', activitySummary.id);

        if (!this.keepRunning) { return 0; }
        await this.delay(1000);
        if (!this.keepRunning) { return 0; }

        this.OnIndexedSubject$.next(activitySummary.name);

        const kwCount = await this.activityKeywords.where('activity').equals(activitySummary.id).count();
        const aCount = await this.activities.where('activity').equals(activitySummary.id).count();

        console.log('Counts', activitySummary.name, kwCount, aCount);

        //   if (kwCount > 0 && aCount > 0) { continue; }

        await this.activityKeywords.where('activity').equals(activitySummary.id).delete();
        await this.activities.where('activity').equals(activitySummary.id).delete();

        await this.loadActivity(activitySummary);
        //   await this.indexActivity(activitySummary);


      } catch (e)     {
        console.error('Error processing', activitySummary.id, e);
      }
    }
    return activities.length;
  }

  async indexAll(page: number) {
    while (await this.index(page) > 0 && this.keepRunning) {
      page++;
    }
  }

  indexOb(page?: number): Observable<string> {

    page = page || 1;

    this.keepRunning = true;

    const simpleObservable = new Observable<string>((observer) => {
      this.indexAll(page).then(() => observer.next('Done')).finally(() => observer.complete());
    });
    return simpleObservable;
  }


  public stop() {
    this.keepRunning = false;
  }


  private async loadActivity(activitySummary: SummaryActivity) {
    console.log('foreach', activitySummary.id);



    if (!this.keepRunning) { return 0; }

    await this.httpClient.post('/.netlify/functions/index',
      { token: AuthenticationModule.accesstoken, id: activitySummary.id }).toPromise<any>();


  }

  async find(term, segments?: string[] ): Promise<Activity[]> {

    const segmentsFilter = segments  ?
      segments.map( (m, i) => `segments/any(s${i}: s${i} eq '${m}')`).join(' and ')
      : null;

    const rval: Activity[] = [];



    const searchResults =
      await this.client.search( term ? term.replace(/(\w+)/g, '$1~1')  : null ,
        {

          top: 50,
          filter:  segmentsFilter,
          facets: ['segments,count:20', 'cities' ],

          select: ['id', 'title', 'description', 'when'],
          highlightFields: 'title,description,segments,cities' ,
          orderBy:  [ 'search.score() desc', 'when desc'],
          queryType: 'full',
          searchMode: 'all'
        });

    console.log('searchResults', searchResults);
    this.FacetsSubject$.next(searchResults.facets);

    for await (const result of searchResults.results) {
      rval.push(
        { activity: result.id, title: result.title, description: result.description, highlights: result.highlights,
          when: result.when, score: result.score, map: this.mapUrl(result.id) });
    }
    console.log('searchResults', searchResults);
    return rval;

  }

  // async segmentFacets(term): Promise<any[]> {

  //   console.log('find', term);
  //   const rval: Activity[] = [];

  //   const client = new SearchClient<any>(
  //     'https://search-strava.search.windows.net',
  //     'activities',
  //     new AzureKeyCredential('A77A8A928D5B9FED811EA2EA24C3992C')
  //   );

  //   client.

  //   return rval;
  // }

  onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  byCount(array) {
    const frequency = {};
    array.forEach((value) => { frequency[value] = 0; });
    const uniques = array.filter((value) => {
      return ++frequency[value] === 1;
    });
    console.log('uniques', uniques);
    console.log('frequency', frequency);
    return uniques.filter((f) => frequency[f] > 0).sort((a, b) => frequency[b] - frequency[a]);
  }

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(resolve, ms));
  }

  mapUrl(id): Observable<string> {

    return of('test');
    // return this.activitiesService.getActivityById(id).pipe(map(a => 'https://d3o5xota0a1fcr.cloudfront.net/maps/' + a.map.id));
  }

}
