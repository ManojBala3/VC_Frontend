import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewVisitComponent } from './viewvisit.component';

describe('VieworderComponent', () => {
  let component: ViewVisitComponent;
  let fixture: ComponentFixture<ViewVisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewVisitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
