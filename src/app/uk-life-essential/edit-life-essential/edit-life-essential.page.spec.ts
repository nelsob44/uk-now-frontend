import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLifeEssentialPage } from './edit-life-essential.page';

describe('EditLifeEssentialPage', () => {
  let component: EditLifeEssentialPage;
  let fixture: ComponentFixture<EditLifeEssentialPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLifeEssentialPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLifeEssentialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
