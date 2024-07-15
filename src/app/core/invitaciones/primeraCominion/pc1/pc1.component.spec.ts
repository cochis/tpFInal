import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pc1Component } from './pc1.component';

describe('Pc1Component', () => {
  let component: Pc1Component;
  let fixture: ComponentFixture<Pc1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Pc1Component]
    });
    fixture = TestBed.createComponent(Pc1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
