import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearBoletoComponent } from './crear-boleto.component';

describe('CrearBoletoComponent', () => {
  let component: CrearBoletoComponent;
  let fixture: ComponentFixture<CrearBoletoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearBoletoComponent]
    });
    fixture = TestBed.createComponent(CrearBoletoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
