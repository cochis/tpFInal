import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearPromoComponent } from './crear-promo.component';

describe('CrearPromoComponent', () => {
  let component: CrearPromoComponent;
  let fixture: ComponentFixture<CrearPromoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearPromoComponent]
    });
    fixture = TestBed.createComponent(CrearPromoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
