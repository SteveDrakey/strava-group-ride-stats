import { Component, OnInit, AfterViewInit } from '@angular/core';
import { RideIndexerService, Activity } from '../ride-indexer.service';
import { Observable } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';
import { Router, ActivatedRoute } from '@angular/router';
import { threadId } from 'worker_threads';
import { throwToolbarMixedModesError } from '@angular/material/toolbar';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-free-search',
  templateUrl: './free-search.component.html',
  styleUrls: ['./free-search.component.scss']
})
export class FreeSearchComponent implements OnInit {

  public search: string;
  public segments: string[];

  public rides: Array<Activity>;
  indexProgress: Observable<string>;
  public facets$: Observable<any>;
  constructor(
    private rideIndexerService: RideIndexerService,
    private router: Router, private activatedRoute: ActivatedRoute,
    readonly viewportScroller: ViewportScroller) {
    this.facets$ = this.rideIndexerService.Facets$;
    this.activatedRoute.queryParams.subscribe(async params => {
      console.log('p', params);
      this.search = params.q;
      this.segments = params.s ? Array.isArray(params.s) ? params.s : [ params.s ] : null;

      this.rides = await this.rideIndexerService.find(this.search, this.segments);

      this.viewportScroller.scrollToPosition([0, 0]);
    });
   }


  ngOnInit(): void {


  }

  importRides() {
    this.indexProgress = this.rideIndexerService.OnIndexed$;
    this.rideIndexerService.indexOb().subscribe((s) => console.log('sub', s));


    // await this.rideIndexerService.index();
  }

  async reset() {
    await this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
      });
  }

  async changeSelected(e, v) {
    console.log('e', e, v);

  }

  async stopImportRides() {
    this.rideIndexerService.stop();
  }

  async segmentChanged(e, v) {
    const selected =  v.map( m => m.value);
    if (selected) {
      await this.router.navigate(
        [],
        {
          relativeTo: this.activatedRoute,
          queryParams: { s: selected },
          queryParamsHandling: 'merge',
        });

    }

  }

  async searchRides() {
    await this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: { q: this.search },
        queryParamsHandling: 'merge'
      });

  }


  pickColour(value) {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      // tslint:disable-next-line: no-bitwise
      hash = value.charCodeAt(i) + ((hash << 5) - hash);
      // tslint:disable-next-line: no-bitwise
      hash = hash & hash; // Convert to 32bit integer
    }
    const shortened = hash % 360;
    return 'hsl(' + shortened + ',100%,60%)';
  }

  public map(id) {
    console.log(id);
    return this.rideIndexerService.mapUrl(id);
  }
}
