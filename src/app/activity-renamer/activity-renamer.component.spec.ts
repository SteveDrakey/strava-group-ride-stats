import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityRenamerComponent } from './activity-renamer.component';

describe('ActivityRenamerComponent', () => {
  let component: ActivityRenamerComponent;
  let fixture: ComponentFixture<ActivityRenamerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivityRenamerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityRenamerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
