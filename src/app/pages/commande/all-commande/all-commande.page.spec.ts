import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllCommandePage } from './all-commande.page';

describe('AllCommandePage', () => {
  let component: AllCommandePage;
  let fixture: ComponentFixture<AllCommandePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllCommandePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllCommandePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
