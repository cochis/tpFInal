import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompartirGaleriaComponent } from './compartir-galeria.component';

describe('CompartirGaleriaComponent', () => {
  let component: CompartirGaleriaComponent;
  let fixture: ComponentFixture<CompartirGaleriaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompartirGaleriaComponent]
    });
    fixture = TestBed.createComponent(CompartirGaleriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
