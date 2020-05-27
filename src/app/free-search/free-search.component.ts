import { Component, OnInit } from '@angular/core';
import { RideIndexerService, Activity } from '../ride-indexer.service';
import { Observable } from 'rxjs';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-free-search',
  templateUrl: './free-search.component.html',
  styleUrls: ['./free-search.component.scss']
})
export class FreeSearchComponent implements OnInit {

  public search: string;
  public rides: Array<Activity> ;
  indexProgress: Observable<string>;
  constructor(private rideIndexerService: RideIndexerService) { }

  ngOnInit(): void {
  }

   importRides()  {
    this.indexProgress = this.rideIndexerService.OnIndexed$;
    this.rideIndexerService.indexOb().subscribe( (s) => console.log('sub', s));


  // await this.rideIndexerService.index();
  }

  async stopImportRides() {
    this.rideIndexerService.stop();
  }

  async searchRides()  {
    this.rides = await this.rideIndexerService.find(this.search);
   }

}
