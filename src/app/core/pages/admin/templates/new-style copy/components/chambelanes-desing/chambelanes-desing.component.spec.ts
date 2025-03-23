import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChambelanesDesingComponent } from './chambelanes-desing.component';

describe('ChambelanesDesingComponent', () => {
  let component: ChambelanesDesingComponent;
  let fixture: ComponentFixture<ChambelanesDesingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChambelanesDesingComponent]
    });
    fixture = TestBed.createComponent(ChambelanesDesingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
