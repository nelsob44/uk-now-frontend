import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMentorPage } from './edit-mentor.page';

describe('EditMentorPage', () => {
  let component: EditMentorPage;
  let fixture: ComponentFixture<EditMentorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMentorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMentorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
