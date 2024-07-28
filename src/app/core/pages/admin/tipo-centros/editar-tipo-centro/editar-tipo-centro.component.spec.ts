import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarTipoCentroComponent } from './editar-tipo-centro.component';

describe('EditarTipoCentroComponent', () => {
  let component: EditarTipoCentroComponent;
  let fixture: ComponentFixture<EditarTipoCentroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarTipoCentroComponent]
    });
    fixture = TestBed.createComponent(EditarTipoCentroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
