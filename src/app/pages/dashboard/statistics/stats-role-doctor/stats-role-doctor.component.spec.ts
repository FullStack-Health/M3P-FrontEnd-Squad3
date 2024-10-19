import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsRoleDoctorComponent } from './stats-role-doctor.component';

describe('StatsRoleDoctorComponent', () => {
  let component: StatsRoleDoctorComponent;
  let fixture: ComponentFixture<StatsRoleDoctorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsRoleDoctorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatsRoleDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
