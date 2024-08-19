import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddVisitComponent } from './addvisit.component';

describe('AddVisitComponent', () => {
  let component: AddVisitComponent;
  let fixture: ComponentFixture<AddVisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddVisitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
