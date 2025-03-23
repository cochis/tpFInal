import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDesingComponent } from './menu-desing.component';

describe('MenuDesingComponent', () => {
  let component: MenuDesingComponent;
  let fixture: ComponentFixture<MenuDesingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MenuDesingComponent]
    });
    fixture = TestBed.createComponent(MenuDesingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
