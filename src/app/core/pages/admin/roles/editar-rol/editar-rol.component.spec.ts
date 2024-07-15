import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarRolComponent } from './editar-rol.component';

describe('EditarRolComponent', () => {
  let component: EditarRolComponent;
  let fixture: ComponentFixture<EditarRolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarRolComponent]
    });
    fixture = TestBed.createComponent(EditarRolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
