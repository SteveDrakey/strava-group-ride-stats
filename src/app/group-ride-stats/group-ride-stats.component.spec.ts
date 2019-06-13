import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupRideStatsComponent } from './group-ride-stats.component';


describe('GroupRideStatsComponent', () => {
  let component: GroupRideStatsComponent;
  let fixture: ComponentFixture<GroupRideStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupRideStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupRideStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
