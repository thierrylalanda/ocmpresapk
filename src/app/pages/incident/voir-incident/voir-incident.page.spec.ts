import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoirIncidentPage } from './voir-incident.page';

describe('VoirIncidentPage', () => {
  let component: VoirIncidentPage;
  let fixture: ComponentFixture<VoirIncidentPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoirIncidentPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoirIncidentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
