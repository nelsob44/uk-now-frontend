import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditYourLocalPage } from './edit-your-local.page';

describe('EditYourLocalPage', () => {
  let component: EditYourLocalPage;
  let fixture: ComponentFixture<EditYourLocalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditYourLocalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditYourLocalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
