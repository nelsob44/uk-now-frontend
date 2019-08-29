import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YourLocalPage } from './your-local.page';

describe('YourLocalPage', () => {
  let component: YourLocalPage;
  let fixture: ComponentFixture<YourLocalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YourLocalPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YourLocalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
