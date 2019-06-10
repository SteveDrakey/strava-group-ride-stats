import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastRideDetailsComponent } from './last-ride-details.component';

describe('LastRideDetailsComponent', () => {
  let component: LastRideDetailsComponent;
  let fixture: ComponentFixture<LastRideDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastRideDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastRideDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
