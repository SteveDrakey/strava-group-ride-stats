import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectToStravaComponent } from './connect-to-strava.component';

describe('ConnectToStravaComponent', () => {
  let component: ConnectToStravaComponent;
  let fixture: ComponentFixture<ConnectToStravaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConnectToStravaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectToStravaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
