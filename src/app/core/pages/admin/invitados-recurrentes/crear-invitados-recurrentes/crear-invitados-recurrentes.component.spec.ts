import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearInvitadosRecurrentesComponent } from './crear-invitados-recurrentes.component';

describe('CrearInvitadosRecurrentesComponent', () => {
  let component: CrearInvitadosRecurrentesComponent;
  let fixture: ComponentFixture<CrearInvitadosRecurrentesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearInvitadosRecurrentesComponent]
    });
    fixture = TestBed.createComponent(CrearInvitadosRecurrentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
