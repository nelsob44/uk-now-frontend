import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AskAQuestionPage } from './ask-a-question.page';

describe('AskAQuestionPage', () => {
  let component: AskAQuestionPage;
  let fixture: ComponentFixture<AskAQuestionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AskAQuestionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AskAQuestionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
