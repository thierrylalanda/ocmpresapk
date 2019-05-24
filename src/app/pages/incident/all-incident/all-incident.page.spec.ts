import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllIncidentPage } from './all-incident.page';

describe('AllIncidentPage', () => {
  let component: AllIncidentPage;
  let fixture: ComponentFixture<AllIncidentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllIncidentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllIncidentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
