import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopmenuEditCommandeComponent } from './popmenu-edit-commande.component';

describe('PopmenuEditCommandeComponent', () => {
  let component: PopmenuEditCommandeComponent;
  let fixture: ComponentFixture<PopmenuEditCommandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopmenuEditCommandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopmenuEditCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
