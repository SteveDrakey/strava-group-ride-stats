import { Injectable } from '@angular/core';
import Dexie from 'dexie';

@Injectable({
  providedIn: 'root'
})
export class DexieService  extends Dexie {
  constructor() {
    super('strava');
    console.log('constructor');
    this.version(1).stores({
      activities: 'activity,title,when,whoWith,segments',
      activityKeywords: 'id++,activity,word'
    });
  }
}
