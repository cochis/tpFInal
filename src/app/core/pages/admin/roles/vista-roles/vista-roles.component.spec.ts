import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaRolesComponent } from './vista-roles.component';

describe('VistaRolesComponent', () => {
  let component: VistaRolesComponent;
  let fixture: ComponentFixture<VistaRolesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaRolesComponent]
    });
    fixture = TestBed.createComponent(VistaRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
