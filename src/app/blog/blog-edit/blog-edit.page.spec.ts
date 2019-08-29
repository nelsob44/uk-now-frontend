import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogEditPage } from './blog-edit.page';

describe('BlogEditPage', () => {
  let component: BlogEditPage;
  let fixture: ComponentFixture<BlogEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogEditPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
