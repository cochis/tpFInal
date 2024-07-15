import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Boda1Component } from './boda1.component';

describe('Boda1Component', () => {
  let component: Boda1Component;
  let fixture: ComponentFixture<Boda1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Boda1Component]
    });
    fixture = TestBed.createComponent(Boda1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
