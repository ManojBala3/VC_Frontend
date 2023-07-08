import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewitemComponent } from './viewitem.component';

describe('ViewitemComponent', () => {
  let component: ViewitemComponent;
  let fixture: ComponentFixture<ViewitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewitemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
