import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizResultsPage } from './quiz-results.page';

describe('QuizResultsPage', () => {
  let component: QuizResultsPage;
  let fixture: ComponentFixture<QuizResultsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuizResultsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizResultsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
