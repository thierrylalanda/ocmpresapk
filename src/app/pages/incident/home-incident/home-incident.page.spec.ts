import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeIncidentPage } from './home-incident.page';

describe('HomeIncidentPage', () => {
  let component: HomeIncidentPage;
  let fixture: ComponentFixture<HomeIncidentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeIncidentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeIncidentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
