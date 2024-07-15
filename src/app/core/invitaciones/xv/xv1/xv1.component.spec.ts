import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Xv1Component } from './xv1.component';

describe('Xv1Component', () => {
  let component: Xv1Component;
  let fixture: ComponentFixture<Xv1Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Xv1Component]
    });
    fixture = TestBed.createComponent(Xv1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
