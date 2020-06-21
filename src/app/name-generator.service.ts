import { Injectable } from '@angular/core';
import { ActivitiesService, SegmentsService } from './api/api';
import { UpdatableActivity } from './model/updatableActivity';
import { Console } from 'console';

@Injectable({
  providedIn: 'root'
})
export class NameGeneratorService {



  constructor(protected activitiesService: ActivitiesService, protected segmentsService: SegmentsService) { }

  async CoolName(activityId?: number): Promise<string> {

    if (!activityId) {
      const activities = await this.activitiesService.getLoggedInAthleteActivities().toPromise();
      activityId = activities[0].id;
    }

    const activity = await this.activitiesService.getActivityById(activityId).toPromise();




    let segmentNames = activity.segment_efforts.filter(f => f.segment.city && f.segment.city.length > 3).map(m => m.segment.city);

    for (const segment of segmentNames) {
      // console.log('seg', `${segment.segment.name}, ${segment.segment.city} ${segment.segment.start_latlng}`);
      console.log('seg', `${segment} : ${segment.replace(/(\b(\w{1,3})\b(\W|$))/g, '')} `);
    }

    segmentNames = segmentNames.map(m => m.replace(/(\b(\w{1,3})\b(\W|$))/g, '').trim());

    const sentence = this.joinSentence(this.byCount(segmentNames).slice(0, 3), false);
    return `Riding around ${sentence}`;
  }

  async UpdateName(activityId?: number): Promise<any> {

    if (!activityId) {
      const activities = await this.activitiesService.getLoggedInAthleteActivities().toPromise();
      activityId = activities[0].id;
    }

    const coolName = await this.CoolName(activityId);
    const update: UpdatableActivity = { name: coolName };
    await this.activitiesService.updateActivityById(activityId, update).toPromise();
  }


  mostFrequent(array) {
    const map = array.map((a) => array.filter((b) => a === b).length);
    return array[map.indexOf(Math.max.apply(null, map))];
  }

  byCount(array) {
    const frequency = {};

    array.forEach((value) => { frequency[value] = 0; });

    const uniques = array.filter((value) => {
      return ++frequency[value] === 1;
    });

    console.log('uniques', uniques);
    console.log('frequency', frequency);
    return uniques.filter((f) => frequency[f] > 1).sort((a, b) => frequency[b] - frequency[a]);
  }

  joinSentence(array, oxfordComma) {
    let lastWord: string;
    if (array.length > 1) {
      lastWord = ' and ' + array.pop();
      if (oxfordComma && array.length > 1) {
        lastWord = ',' + lastWord;
      }
    } else {
      lastWord = '';
    }
    return array.join(', ') + lastWord;
  }
}

