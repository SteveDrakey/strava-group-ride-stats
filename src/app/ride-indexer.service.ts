import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { DexieService } from './dexie.service';
import { ActivitiesService, SegmentsService } from './api/api';
import { flatten } from '@angular/compiler';
import { Observable, observable, combineLatest, forkJoin, from, Subscriber, concat, BehaviorSubject } from 'rxjs';
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
  highlights?: any;
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

  constructor(
    private dexieService: DexieService,
    protected activitiesService: ActivitiesService, protected segmentsService: SegmentsService,
    private httpClient: HttpClient
  ) {
    this.activities = this.dexieService.table('activities');
    this.activityKeywords = this.dexieService.table('activityKeywords');

    this.OnIndexedSubject$ = new BehaviorSubject<string>('');
    this.OnIndexed$ = this.OnIndexedSubject$.asObservable();

  }

  async index(page: number): Promise<number> {
    const activities = await this.activitiesService.getLoggedInAthleteActivities(null, null, page, 30).toPromise();
    for (const activitySummary of activities.slice(1, 100)) {
      try {

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


      } catch     {
        console.error('Error processing', activitySummary.id);
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

  async find(term): Promise<Activity[]> {

    const rval: Activity[] = [];

    const client = new SearchClient<any>(
      'https://search-strava.search.windows.net',
      'activities',
      new AzureKeyCredential('A77A8A928D5B9FED811EA2EA24C3992C')
    );

    const searchResults =
      await client.search(term.replace(/(\w+)/g, '$1~1'),
        {
          select: ['id', 'title', 'description'],
          highlightFields: 'title,description,segments,cities' ,
          queryType: 'full',
          searchMode: 'all'
        });
    console.log(searchResults);
    for await (const result of searchResults.results) {
      rval.push({ activity: result.id, title: result.title, description: result.description, highlights: result.highlights });
      console.log(result.highlights);
    }

    return rval;

  }

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

}
