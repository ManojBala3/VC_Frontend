import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateVisitComponent } from './updatevisit.component';

describe('UpdateVisitComponent', () => {
  let component: UpdateVisitComponent;
  let fixture: ComponentFixture<UpdateVisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateVisitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
