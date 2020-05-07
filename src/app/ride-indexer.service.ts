import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { DexieService } from './dexie.service';
import { ActivitiesService, SegmentsService } from './api/api';
import { flatten } from '@angular/compiler';
import { Observable, observable, combineLatest, forkJoin, from, Subscriber } from 'rxjs';
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

  constructor(
    private dexieService: DexieService,
    protected activitiesService: ActivitiesService, protected segmentsService: SegmentsService
  ) {
    this.activities = this.dexieService.table('activities');
    this.activityKeywords = this.dexieService.table('activityKeywords');
  }

  async index() {
    const activities = await this.activitiesService.getLoggedInAthleteActivities(null, null, null, 100).toPromise();
    for (const activitySummary of activities.slice(1, 100)) {
      try {
        console.log('Indexing', activitySummary.id);
        // delete first
        this.activityKeywords.where('activity').equals(activitySummary.id).delete().then((d) => console.log('Deleting main row', d));
        this.activities.where('activity').equals(activitySummary.id).delete().then((d) => console.log('Deleting words', d));

        const activity = await this.activitiesService.getActivityById(activitySummary.id).toPromise();
        let tempArray = activity.name.toLowerCase().match(/\b(\w+)\b/g);
        for (const segment of activity.segment_efforts) {
          if (segment.name) {
            tempArray = tempArray.concat(segment.name.toLowerCase().match(/\b(\w+)\b/g));
          }
          if (segment.segment.city) { tempArray = tempArray.concat(segment.segment.city.toLowerCase().match(/\b(\w+)\b/g)); }
        }
        tempArray = tempArray.filter(this.onlyUnique);
        for (const word of tempArray) {
          this.activityKeywords.add({ activity: activity.id, word });
        }
        this.activities.add({ activity: activity.id, title: activity.name });
      } catch     {
        console.error('Error processing', activitySummary.id);
      }
    }
  }

  indexOb(): Observable<string> {
    const simpleObservable = new Observable<string>((observer) => {
      const allSearch = new Array<Observable<any>>();
      observer.next('loading rides');
      this.activitiesService.getLoggedInAthleteActivities(null, null, 1, 6).subscribe((activities) => {
        console.log('loaded rides');
        from(activities).pipe(mergeMap((activitySummary) => {
          return this.loadActivity(activitySummary, observer);
        }
          , 2)).subscribe(
            (s) => { }, (err) => console.error(err), () => observer.next('All rides loaded, whoop whoop (well a sample have been)')
          );
      });
    });
    return simpleObservable;
  }

  private loadActivity(activitySummary: SummaryActivity, observer: Subscriber<string>): Observable<void> {
    console.log('foreach');
    this.activityKeywords.where('activity').equals(activitySummary.id).delete();
    this.activities.where('activity').equals(activitySummary.id).delete();
    const sub = this.activitiesService.getActivityById(activitySummary.id).pipe(delay(1000), map((activity) => {
      console.log('callback');
      let tempArray = activity.name.toLowerCase().match(/\b(\w+)\b/g);
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
      observer.next('Indexing ' + activity.name);
    }));
    return sub;
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
}
