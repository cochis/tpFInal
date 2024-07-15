import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Xv2Component } from './xv2.component';

describe('Xv2Component', () => {
  let component: Xv2Component;
  let fixture: ComponentFixture<Xv2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Xv2Component]
    });
    fixture = TestBed.createComponent(Xv2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
