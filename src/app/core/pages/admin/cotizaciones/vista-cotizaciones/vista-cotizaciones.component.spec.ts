import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaCotizacionesComponent } from './vista-cotizaciones.component';

describe('VistaCotizacionesComponent', () => {
  let component: VistaCotizacionesComponent;
  let fixture: ComponentFixture<VistaCotizacionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaCotizacionesComponent]
    });
    fixture = TestBed.createComponent(VistaCotizacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
