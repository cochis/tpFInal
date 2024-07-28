import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearTipoCentroComponent } from './crear-tipo-centro.component';

describe('CrearTipoCentroComponent', () => {
  let component: CrearTipoCentroComponent;
  let fixture: ComponentFixture<CrearTipoCentroComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearTipoCentroComponent]
    });
    fixture = TestBed.createComponent(CrearTipoCentroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
