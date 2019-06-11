import { Injectable } from '@angular/core';
import { ActivitiesService } from './api/activities.service';
import { SegmentsService } from './api/segments.service';
import { Observable } from 'rxjs';
import { stringify } from '@angular/core/src/render3/util';

@Injectable({
  providedIn: 'root'
})
export class GroupRideLeadersService {

  constructor(protected activitiesService: ActivitiesService, protected segmentsService: SegmentsService) { }

  LeadBoard(activityId?: number): Observable<Leader[]> {


    const getRoundedDate = (minutes: number, d= new Date()): Date => {

      const ms = 1000 * 60 * minutes; // convert minutes to ms
      const roundedDate = new Date(Math.round(d.getTime() / ms) * ms);
      return roundedDate;
    };


    return Observable.create(async (observer: { next: (arg0: Leader[]) => void; }) => {

      const rval: Leader[] = new Array();
      if (!activityId) {
        const activitys = await this.activitiesService.getLoggedInAthleteActivities().toPromise();
        console.log('activitys', activitys[0].id);
        activityId = activitys[0].id;
      }


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
                    .sort( (s1, s2) => s1.elapsed_time - s2.elapsed_time)
                    .slice(0, 3)
                    .map( m => m.athlete_name);

        rval.push({ name: segment.name, first: top3[0] , second: top3[1], third: top3[2], grade: segment.segment.average_grade });
        // rval.push({ name: segment.name});
      }
      observer.next(rval);
    });
  }

  UpHillLeaders( leaders: Leader[] ): LeadTableEntry[] {

    const rval: LeadTableEntry[] = [];

    leaders = leaders.filter( (f) => f.grade > 0);
    return this.Leaders(leaders);
  }

  Leaders(leaders: Leader[]): LeadTableEntry[] {
    const rval: LeadTableEntry[] = [];
    for (const leader of leaders) {
      if (rval.filter( f => f.name === leader.first).length === 0) {
        rval.push( { name: leader.first, points: 0 } );
      }
      if (rval.filter( f => f.name === leader.second).length === 0) {
        rval.push( { name: leader.second, points: 0 } );
      }

      if (rval.filter( f => f.name === leader.third).length === 0) {
        rval.push( { name: leader.third, points: 0 } );
      }
    }

    for (const leader of leaders) {
      rval.filter( f => f.name === leader.first)[0].points += 5;
      rval.filter( f => f.name === leader.second)[0].points += 2;
      rval.filter( f => f.name === leader.third)[0].points += 1;
    }
    console.log('sort one', rval.filter( (f) => f.name).sort( (n1, n2) => n2.points - n1.points));

    return rval.filter( (f) => f.name).sort( (n1, n2) => n2.points - n1.points);
  }

  DownHillLeaders( leaders: Leader[] ): LeadTableEntry[] {
    leaders = leaders.filter( (f) => f.grade < 0);
    return this.Leaders(leaders);
  }
}

export interface Leader {
  name: string;
  first?: string;
  second?: string;
  third?: string;
  grade?: number;
}

export interface LeadTableEntry {
  name: string;
  points: number;
}
