import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaSalonesComponent } from './vista-salones.component';

describe('VistaSalonesComponent', () => {
  let component: VistaSalonesComponent;
  let fixture: ComponentFixture<VistaSalonesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaSalonesComponent]
    });
    fixture = TestBed.createComponent(VistaSalonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
