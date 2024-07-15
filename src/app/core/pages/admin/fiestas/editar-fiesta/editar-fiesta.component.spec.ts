import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarFiestaComponent } from './editar-fiesta.component';

describe('EditarFiestaComponent', () => {
  let component: EditarFiestaComponent;
  let fixture: ComponentFixture<EditarFiestaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarFiestaComponent]
    });
    fixture = TestBed.createComponent(EditarFiestaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
