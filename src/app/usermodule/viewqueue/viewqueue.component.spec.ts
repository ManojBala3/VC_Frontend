import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewqueueComponent } from './viewqueue.component';

describe('ViewqueueComponent', () => {
  let component: ViewqueueComponent;
  let fixture: ComponentFixture<ViewqueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewqueueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewqueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
