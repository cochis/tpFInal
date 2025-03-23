import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramaDesingComponent } from './programa-desing.component';

describe('ProgramaDesingComponent', () => {
  let component: ProgramaDesingComponent;
  let fixture: ComponentFixture<ProgramaDesingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProgramaDesingComponent]
    });
    fixture = TestBed.createComponent(ProgramaDesingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
