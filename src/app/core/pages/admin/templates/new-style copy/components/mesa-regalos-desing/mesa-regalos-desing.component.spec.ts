import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MesaRegalosDesingComponent } from './mesa-regalos-desing.component';

describe('MesaRegalosDesingComponent', () => {
  let component: MesaRegalosDesingComponent;
  let fixture: ComponentFixture<MesaRegalosDesingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MesaRegalosDesingComponent]
    });
    fixture = TestBed.createComponent(MesaRegalosDesingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
