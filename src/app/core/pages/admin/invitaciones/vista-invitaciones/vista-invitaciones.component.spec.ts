import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaInvitacionesComponent } from './vista-invitaciones.component';

describe('VistaInvitacionesComponent', () => {
  let component: VistaInvitacionesComponent;
  let fixture: ComponentFixture<VistaInvitacionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaInvitacionesComponent]
    });
    fixture = TestBed.createComponent(VistaInvitacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
