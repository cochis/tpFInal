import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensajeDesingComponent } from './mensaje-desing.component';

describe('MensajeDesingComponent', () => {
  let component: MensajeDesingComponent;
  let fixture: ComponentFixture<MensajeDesingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MensajeDesingComponent]
    });
    fixture = TestBed.createComponent(MensajeDesingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
