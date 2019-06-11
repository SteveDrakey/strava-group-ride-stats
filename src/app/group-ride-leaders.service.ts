import { Injectable } from '@angular/core';
import { ActivitiesService } from './api/activities.service';
import { SegmentsService } from './api/segments.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupRideLeadersService {

  constructor(protected activitiesService: ActivitiesService, protected segmentsService: SegmentsService) { }

  LeadBoard(activityId: number): Observable<Leader[]> {

    const getRoundedDate = (minutes: number, d= new Date()): Date => {

      const ms = 1000 * 60 * minutes; // convert minutes to ms
      const roundedDate = new Date(Math.round(d.getTime() / ms) * ms);
      return roundedDate;
    };


    return Observable.create(async (observer: { next: (arg0: Leader[]) => void; }) => {

      const rval: Leader[] = new Array();
      const activity = await this.activitiesService.getActivityById(activityId).toPromise();

      for await (const segment of activity.segment_efforts) {

        const startDate = getRoundedDate(10, new Date( segment.start_date));

        const leaders = await
          this.segmentsService.getLeaderboardBySegmentId(segment.segment.id, null, null, null, null, null, 'this_week', null, null, null)
            .toPromise();

        const downHill = segment.segment.average_grade < 0;
        const direction = downHill ? 'D' : 'U';

        const top3 = leaders.entries
                    .filter(f => getRoundedDate(10, new Date( f.start_date)).valueOf() === startDate.valueOf() )
                    .sort(s => s.elapsed_time)
                    .slice(0, 3)
                    .map( m => m.athlete_name);

        rval.push({ name: segment.name, first: top3[0] , second: top3[1], third: top3[2], grade: segment.segment.average_grade });
        // rval.push({ name: segment.name});
      }
      observer.next(rval);
    });
  }
}

export interface Leader {
  name: string;
  first?: string;
  second?: string;
  third?: string;
  grade?: number;
}
