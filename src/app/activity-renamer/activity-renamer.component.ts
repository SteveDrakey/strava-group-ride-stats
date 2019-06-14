import { Component, OnInit } from '@angular/core';
import { NameGeneratorService } from '../name-generator.service';

@Component({
  selector: 'app-activity-renamer',
  templateUrl: './activity-renamer.component.html',
  styleUrls: ['./activity-renamer.component.scss']
})
export class ActivityRenamerComponent implements OnInit {

  constructor(protected nameGeneratorService: NameGeneratorService ) { }

  async ngOnInit() {
    await this.nameGeneratorService.CoolName();
  }

}
