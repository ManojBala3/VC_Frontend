import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateitemComponent } from './updatemedicine.component';

describe('UpdateitemComponent', () => {
  let component: UpdateitemComponent;
  let fixture: ComponentFixture<UpdateitemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateitemComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
