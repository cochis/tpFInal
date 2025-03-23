import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionDesingComponent } from './confirmacion-desing.component';

describe('ConfirmacionDesingComponent', () => {
  let component: ConfirmacionDesingComponent;
  let fixture: ComponentFixture<ConfirmacionDesingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmacionDesingComponent]
    });
    fixture = TestBed.createComponent(ConfirmacionDesingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
