import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMedicineComponent } from './viewmedicine.component';

describe('ViewitemComponent', () => {
  let component: ViewMedicineComponent;
  let fixture: ComponentFixture<ViewMedicineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewMedicineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewMedicineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
