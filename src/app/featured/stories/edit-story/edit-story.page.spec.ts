import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStoryPage } from './edit-story.page';

describe('EditStoryPage', () => {
  let component: EditStoryPage;
  let fixture: ComponentFixture<EditStoryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditStoryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStoryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
