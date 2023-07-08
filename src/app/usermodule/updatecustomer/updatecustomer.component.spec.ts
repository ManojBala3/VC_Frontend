import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatecustomerComponent } from './updatecustomer.component';

describe('UpdatecustomerComponent', () => {
  let component: UpdatecustomerComponent;
  let fixture: ComponentFixture<UpdatecustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdatecustomerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatecustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
