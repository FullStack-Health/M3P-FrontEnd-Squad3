import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsRoleAdminComponent } from './stats-role-admin.component';

describe('StatsRoleAdminComponent', () => {
  let component: StatsRoleAdminComponent;
  let fixture: ComponentFixture<StatsRoleAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatsRoleAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StatsRoleAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
