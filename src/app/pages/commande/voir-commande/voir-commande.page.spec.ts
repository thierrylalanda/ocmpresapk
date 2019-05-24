import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoirCommandePage } from './voir-commande.page';

describe('VoirCommandePage', () => {
  let component: VoirCommandePage;
  let fixture: ComponentFixture<VoirCommandePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoirCommandePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoirCommandePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
