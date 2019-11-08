import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteQuizPage } from './delete-quiz.page';

describe('DeleteQuizPage', () => {
  let component: DeleteQuizPage;
  let fixture: ComponentFixture<DeleteQuizPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteQuizPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteQuizPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
