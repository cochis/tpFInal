import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospedajeDesingComponent } from './hospedaje-desing.component';

describe('HospedajeDesingComponent', () => {
  let component: HospedajeDesingComponent;
  let fixture: ComponentFixture<HospedajeDesingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HospedajeDesingComponent]
    });
    fixture = TestBed.createComponent(HospedajeDesingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
