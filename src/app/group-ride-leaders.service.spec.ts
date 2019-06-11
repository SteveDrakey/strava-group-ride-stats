import { TestBed } from '@angular/core/testing';

import { GroupRideLeadersService } from './group-ride-leaders.service';

describe('GroupRideLeadersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GroupRideLeadersService = TestBed.get(GroupRideLeadersService);
    expect(service).toBeTruthy();
  });
});
