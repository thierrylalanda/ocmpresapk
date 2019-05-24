import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MargePage } from './marge.page';

describe('MargePage', () => {
  let component: MargePage;
  let fixture: ComponentFixture<MargePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MargePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MargePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
