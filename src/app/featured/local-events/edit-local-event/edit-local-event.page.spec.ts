import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLocalEventPage } from './edit-local-event.page';

describe('EditLocalEventPage', () => {
  let component: EditLocalEventPage;
  let fixture: ComponentFixture<EditLocalEventPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLocalEventPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLocalEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
