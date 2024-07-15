import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RememberComponent } from './remember.component';

describe('RememberComponent', () => {
  let component: RememberComponent;
  let fixture: ComponentFixture<RememberComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RememberComponent]
    });
    fixture = TestBed.createComponent(RememberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
