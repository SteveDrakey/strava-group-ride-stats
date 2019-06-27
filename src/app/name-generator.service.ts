import { Injectable } from '@angular/core';
import { ActivitiesService, SegmentsService } from './api/api';
import { UpdatableActivity } from './model/updatableActivity';

@Injectable({
  providedIn: 'root'
})
export class NameGeneratorService {



  constructor(protected activitiesService: ActivitiesService, protected segmentsService: SegmentsService) { }

  async CoolName(activityId?: number): Promise<string> {

    if (!activityId) {
      const activitys = await this.activitiesService.getLoggedInAthleteActivities().toPromise();
      activityId = activitys[0].id;
    }

    const activity = await this.activitiesService.getActivityById(activityId).toPromise();


    const segmentNames = activity.segment_efforts.filter(f => f.segment.city).map(m => m.segment.city);

    for (const segment of activity.segment_efforts.filter(f => f.segment.city)) {
      // console.log('seg', `${segment.segment.name}, ${segment.segment.city} ${segment.segment.start_latlng}`);
      console.log('seg', `${segment.segment.city}`);
    }

    const sentence = this.joinSentence(this.byCount(segmentNames).slice(0, 3), false);
    return `Riding arround ${sentence}`;
  }

  async UpdateName(activityId?: number): Promise<any> {

    if (!activityId) {
      const activitys = await this.activitiesService.getLoggedInAthleteActivities().toPromise();
      activityId = activitys[0].id;
    }

    const coolName = await this.CoolName(activityId);
    const update: UpdatableActivity = { name: coolName} ;
    await this.activitiesService.updateActivityById(activityId, update).toPromise();
  }


  mostFrequent(array) {
    const map = array.map((a) => array.filter((b) => a === b).length);
    return array[map.indexOf(Math.max.apply(null, map))];
  }
  byCount(array) {
    const frequency = {};

    array.forEach(function(value) { frequency[value] = 0; });

    const uniques = array.filter(function(value) {
      return ++frequency[value] == 1;
    });

    return uniques.sort(function(a, b) {
      return frequency[b] - frequency[a];
    });
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

