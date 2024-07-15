import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaBoletosComponent } from './vista-boletos.component';

describe('VistaBoletosComponent', () => {
  let component: VistaBoletosComponent;
  let fixture: ComponentFixture<VistaBoletosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaBoletosComponent]
    });
    fixture = TestBed.createComponent(VistaBoletosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
