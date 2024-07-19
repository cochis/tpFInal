import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoUbicacionComponent } from './info-ubicacion.component';

describe('InfoUbicacionComponent', () => {
  let component: InfoUbicacionComponent;
  let fixture: ComponentFixture<InfoUbicacionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InfoUbicacionComponent]
    });
    fixture = TestBed.createComponent(InfoUbicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
