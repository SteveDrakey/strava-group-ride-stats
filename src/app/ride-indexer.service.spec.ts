import { TestBed } from '@angular/core/testing';

import { RideIndexerService } from './ride-indexer.service';

describe('RideIndexerService', () => {
  let service: RideIndexerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RideIndexerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
