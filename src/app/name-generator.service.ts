import { Injectable } from '@angular/core';
import { ActivitiesService, SegmentsService } from './api/api';

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

    for (const segment of activity.segment_efforts.filter(f => f.segment.city )) {
      // console.log('seg', `${segment.segment.name}, ${segment.segment.city} ${segment.segment.start_latlng}`);
      console.log(segment.segment.city);
    }

    return '';
  }
}
