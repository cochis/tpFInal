import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PadrinosDesingComponent } from './padrinos-desing.component';

describe('PadrinosDesingComponent', () => {
  let component: PadrinosDesingComponent;
  let fixture: ComponentFixture<PadrinosDesingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PadrinosDesingComponent]
    });
    fixture = TestBed.createComponent(PadrinosDesingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
