import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalItemComponent } from './local-item.component';

describe('LocalItemComponent', () => {
  let component: LocalItemComponent;
  let fixture: ComponentFixture<LocalItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalItemComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
