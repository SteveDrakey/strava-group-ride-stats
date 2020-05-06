import { Component, OnInit } from '@angular/core';
import { RideIndexerService, Activity } from '../ride-indexer.service';

@Component({
  selector: 'app-free-search',
  templateUrl: './free-search.component.html',
  styleUrls: ['./free-search.component.scss']
})
export class FreeSearchComponent implements OnInit {

  public search: string;
  public rides: Array<Activity> ;
  constructor(private rideIndexerService: RideIndexerService) { }

  ngOnInit(): void {
  }

  async importRides()  {
   await this.rideIndexerService.index();
  }

  async searchRides()  {
    this.rides = await this.rideIndexerService.find(this.search);
   }

}
