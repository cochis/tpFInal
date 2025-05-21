import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaPostsComponent } from './vista-posts.component';

describe('VistaPostsComponent', () => {
  let component: VistaPostsComponent;
  let fixture: ComponentFixture<VistaPostsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VistaPostsComponent]
    });
    fixture = TestBed.createComponent(VistaPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
