import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UkLifeEssentialPage } from './uk-life-essential.page';

describe('UkLifeEssentialPage', () => {
  let component: UkLifeEssentialPage;
  let fixture: ComponentFixture<UkLifeEssentialPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UkLifeEssentialPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UkLifeEssentialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
