import { Component, OnInit } from '@angular/core';
import { RideIndexerService, Activity } from '../ride-indexer.service';
import { Observable } from 'rxjs';

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
    // this.rideIndexerService.indexOb().subscribe( (s) => console.log('sub', s));


    this.indexProgress =  this.rideIndexerService.indexOb();

  // await this.rideIndexerService.index();
  }

  async searchRides()  {
    this.rides = await this.rideIndexerService.find(this.search);
   }

}
