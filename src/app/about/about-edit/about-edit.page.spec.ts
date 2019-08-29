import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutEditPage } from './about-edit.page';

describe('AboutEditPage', () => {
  let component: AboutEditPage;
  let fixture: ComponentFixture<AboutEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AboutEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
