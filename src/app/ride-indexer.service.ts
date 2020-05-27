import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { DexieService } from './dexie.service';
import { ActivitiesService, SegmentsService } from './api/api';
import { flatten } from '@angular/compiler';
import { Observable, observable, combineLatest, forkJoin, from, Subscriber, concat, BehaviorSubject } from 'rxjs';
import { DetailedActivity, SummaryActivity } from './model/models';
import { map, mergeMap, delay } from 'rxjs/operators';

export interface Activity {
  activity: number;
  title: string;
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
    protected activitiesService: ActivitiesService, protected segmentsService: SegmentsService
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

        if (kwCount > 0 && aCount > 0) { continue; }

        await this.activityKeywords.where('activity').equals(activitySummary.id).delete();
        await this.activities.where('activity').equals(activitySummary.id).delete();

        await this.loadActivity(activitySummary);

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


  private async  loadActivity(activitySummary: SummaryActivity) {
    console.log('foreach', activitySummary.id);

    if (!this.keepRunning) { return 0; }
    const activity = await this.activitiesService.getActivityById(activitySummary.id).toPromise();
    if (!this.keepRunning) { return 0; }
    console.log('callback', activitySummary.id, activity.name);
    let tempArray = activity.name.toLowerCase().match(/\b(\w+)\b/g) || new Array<string>();

    for (const segment of activity.segment_efforts) {
      if (segment.name) {
        tempArray = tempArray.concat(segment.name.toLowerCase().match(/\b(\w+)\b/g));
      }
      if (segment.segment.city) {
        tempArray = tempArray.concat(segment.segment.city.toLowerCase().match(/\b(\w+)\b/g));
      }
    }
    tempArray = tempArray.filter(this.onlyUnique);
    for (const word of tempArray) {
      this.activityKeywords.add({ activity: activity.id, word });
    }
    this.activities.add({ activity: activity.id, title: activity.name });
    console.log('Indexing', activity.name);
  }

  async find(term): Promise<Activity[]> {
    console.log('term', term);
    const prefixes = term.toLowerCase().match(/\b(\w+)\b/g);
    console.log('prefixes', prefixes);
    const result = [];
    const rval = new Array<Activity>();

    await Promise.all(
      prefixes.map(prefix =>
        this.activityKeywords.where('word').startsWith(prefix).each((x) => {
          result.push(x.activity);
        })));

    console.log('result', result);
    console.log('result by count', this.byCount(result));
    // for (const item of  this.byCount( result.filter(this.onlyUnique))) {
    for (const item of this.byCount(result)) {
      this.activities.where('activity').equals(item).each((a) => rval.push(a));
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
