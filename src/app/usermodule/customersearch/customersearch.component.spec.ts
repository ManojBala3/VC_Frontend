import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersearchComponent } from './customersearch.component';

describe('CustomersearchComponent', () => {
  let component: CustomersearchComponent;
  let fixture: ComponentFixture<CustomersearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomersearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
