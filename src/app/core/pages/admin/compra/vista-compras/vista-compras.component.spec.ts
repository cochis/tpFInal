import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaComprasComponent } from './vista-compras.component';

describe('VistaComprasComponent', () => {
  let component: VistaComprasComponent;
  let fixture: ComponentFixture<VistaComprasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaComprasComponent]
    });
    fixture = TestBed.createComponent(VistaComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
