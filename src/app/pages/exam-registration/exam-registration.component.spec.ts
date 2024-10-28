import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamRegistrationComponent } from './exam-registration.component';

describe('ExamRegistrationComponent', () => {
  let component: ExamRegistrationComponent;
  let fixture: ComponentFixture<ExamRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamRegistrationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExamRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
