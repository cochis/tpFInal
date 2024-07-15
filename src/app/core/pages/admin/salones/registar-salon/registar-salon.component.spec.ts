import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistarSalonComponent } from './registar-salon.component';

describe('RegistarSalonComponent', () => {
  let component: RegistarSalonComponent;
  let fixture: ComponentFixture<RegistarSalonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistarSalonComponent]
    });
    fixture = TestBed.createComponent(RegistarSalonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
