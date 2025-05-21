import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPostComponent } from './editar-post.component';

describe('EditarPostComponent', () => {
  let component: EditarPostComponent;
  let fixture: ComponentFixture<EditarPostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditarPostComponent]
    });
    fixture = TestBed.createComponent(EditarPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
