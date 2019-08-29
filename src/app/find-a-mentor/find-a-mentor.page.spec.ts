import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FindAMentorPage } from './find-a-mentor.page';

describe('FindAMentorPage', () => {
  let component: FindAMentorPage;
  let fixture: ComponentFixture<FindAMentorPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindAMentorPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindAMentorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
