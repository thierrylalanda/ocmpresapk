import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddArticlePage } from './add-article.page';

describe('AddArticlePage', () => {
  let component: AddArticlePage;
  let fixture: ComponentFixture<AddArticlePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddArticlePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddArticlePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
