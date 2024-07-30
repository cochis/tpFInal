import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaInvitadosRecurrentesComponent } from './vista-invitados-recurrentes.component';

describe('VistaInvitadosRecurrentesComponent', () => {
  let component: VistaInvitadosRecurrentesComponent;
  let fixture: ComponentFixture<VistaInvitadosRecurrentesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaInvitadosRecurrentesComponent]
    });
    fixture = TestBed.createComponent(VistaInvitadosRecurrentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
