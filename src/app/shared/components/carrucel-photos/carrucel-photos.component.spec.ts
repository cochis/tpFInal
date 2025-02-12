import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrucelPhotosComponent } from './carrucel-photos.component';

describe('CarrucelPhotosComponent', () => {
  let component: CarrucelPhotosComponent;
  let fixture: ComponentFixture<CarrucelPhotosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CarrucelPhotosComponent]
    });
    fixture = TestBed.createComponent(CarrucelPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
