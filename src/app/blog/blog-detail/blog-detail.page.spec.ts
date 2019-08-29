import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogDetailPage } from './blog-detail.page';

describe('BlogDetailPage', () => {
  let component: BlogDetailPage;
  let fixture: ComponentFixture<BlogDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
