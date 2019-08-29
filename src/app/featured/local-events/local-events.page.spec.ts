import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalEventsPage } from './local-events.page';

describe('LocalEventsPage', () => {
  let component: LocalEventsPage;
  let fixture: ComponentFixture<LocalEventsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalEventsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalEventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
