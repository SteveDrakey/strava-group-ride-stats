import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AthletesService } from '../api/athletes.service';
import { GroupRideLeadersService, Leader, LeadTableEntry } from '../group-ride-leaders.service';
import { AuthenticationModule } from '../authentication/authentication.module';

@Component({
  selector: 'app-group-ride-stats',
  templateUrl: './group-ride-stats.component.html',
  styleUrls: ['./group-ride-stats.component.scss']
})
export class GroupRideStatsComponent implements OnInit {
  code: string;
  leadboard: Leader[] = []; // = [ {name: 'test' } ];

  displayedColumns: string[] = ['grade', 'name', 'first', 'second', 'third'];
  displayedLeaderColumns: string[] = ['name', 'points'];

  upHillLeaders: LeadTableEntry[] = [];
  downHillLeaders: LeadTableEntry[] = [];

  constructor(
    public groupRideLeadersService: GroupRideLeadersService,
    public authentication: AuthenticationModule,
    protected athletesService: AthletesService) {

  }

  async ngOnInit() {
    console.log('AuthenticationModule.accesstoken', AuthenticationModule.accesstoken);

    if (AuthenticationModule.accesstoken) {
      this.setup();
    }

    this.authentication.LoggedIn.subscribe( (s) => {
      if (s == null) {
        this.leadboard = null;
        return;
        this.setup();
      }
    });
  }

  setup() {
    this.groupRideLeadersService.LeadBoard().subscribe((data) => {
      this.leadboard = data;
      this.upHillLeaders = this.groupRideLeadersService.UpHillLeaders(data);
      this.downHillLeaders = this.groupRideLeadersService.DownHillLeaders(data);
    });
  }
}
