import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedDefaultTemplateComponent } from './shared-default-template.component';

describe('SharedDefaultTemplateComponent', () => {
  let component: SharedDefaultTemplateComponent;
  let fixture: ComponentFixture<SharedDefaultTemplateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SharedDefaultTemplateComponent]
    });
    fixture = TestBed.createComponent(SharedDefaultTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
