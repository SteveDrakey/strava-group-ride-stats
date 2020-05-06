import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreeSearchComponent } from './free-search.component';

describe('FreeSearchComponent', () => {
  let component: FreeSearchComponent;
  let fixture: ComponentFixture<FreeSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
