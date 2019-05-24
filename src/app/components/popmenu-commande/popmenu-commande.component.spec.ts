import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopmenuCommandeComponent } from './popmenu-commande.component';

describe('PopmenuCommandeComponent', () => {
  let component: PopmenuCommandeComponent;
  let fixture: ComponentFixture<PopmenuCommandeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopmenuCommandeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopmenuCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
