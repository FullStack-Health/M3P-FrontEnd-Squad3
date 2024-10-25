import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentRegistrationComponent } from './appointment-registration.component';

describe('AppointmentRegistrationComponent', () => {
  let component: AppointmentRegistrationComponent;
  let fixture: ComponentFixture<AppointmentRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointmentRegistrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppointmentRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
