import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryDetailPage } from './story-detail.page';

describe('StoryDetailPage', () => {
  let component: StoryDetailPage;
  let fixture: ComponentFixture<StoryDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StoryDetailPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
