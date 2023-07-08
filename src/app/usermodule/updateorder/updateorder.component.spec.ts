import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateorderComponent } from './updateorder.component';

describe('UpdateorderComponent', () => {
  let component: UpdateorderComponent;
  let fixture: ComponentFixture<UpdateorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateorderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
