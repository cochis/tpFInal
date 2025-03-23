import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicDesingComponent } from './music-desing.component';

describe('MusicDesingComponent', () => {
  let component: MusicDesingComponent;
  let fixture: ComponentFixture<MusicDesingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MusicDesingComponent]
    });
    fixture = TestBed.createComponent(MusicDesingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
