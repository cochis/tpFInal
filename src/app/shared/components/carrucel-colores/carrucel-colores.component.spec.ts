import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrucelColoresComponent } from './carrucel-colores.component';

describe('CarrucelColoresComponent', () => {
  let component: CarrucelColoresComponent;
  let fixture: ComponentFixture<CarrucelColoresComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarrucelColoresComponent]
    });
    fixture = TestBed.createComponent(CarrucelColoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
