import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarInvitadosRecurrentesComponent } from './editar-invitados-recurrentes.component';

describe('EditarInvitadosRecurrentesComponent', () => {
  let component: EditarInvitadosRecurrentesComponent;
  let fixture: ComponentFixture<EditarInvitadosRecurrentesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarInvitadosRecurrentesComponent]
    });
    fixture = TestBed.createComponent(EditarInvitadosRecurrentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
