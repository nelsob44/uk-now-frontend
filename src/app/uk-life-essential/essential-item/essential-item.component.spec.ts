import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EssentialItemComponent } from './essential-item.component';

describe('EssentialItemComponent', () => {
  let component: EssentialItemComponent;
  let fixture: ComponentFixture<EssentialItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EssentialItemComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EssentialItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
