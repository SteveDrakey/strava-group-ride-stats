import { Component, OnInit } from '@angular/core';
import { NameGeneratorService } from '../name-generator.service';
import { AuthenticationModule } from '../authentication/authentication.module';

@Component({
  selector: 'app-activity-renamer',
  templateUrl: './activity-renamer.component.html',
  styleUrls: ['./activity-renamer.component.scss']
})
export class ActivityRenamerComponent implements OnInit {

  constructor(protected nameGeneratorService: NameGeneratorService, public authenticationModule: AuthenticationModule ) { }

  async ngOnInit() {
    console.log('I name that ride', await this.nameGeneratorService.CoolName());
  }

  connectToStrava() {
    console.log('connectToStrava');
    this.authenticationModule.connectToStrava('activity:write,activity:read');
  }

  async updateLastRide() {
    await this.nameGeneratorService.UpdateName();
  }

}
