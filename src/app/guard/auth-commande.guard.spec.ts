import { TestBed, async, inject } from '@angular/core/testing';

import { AuthCommandeGuard } from './auth-commande.guard';

describe('AuthCommandeGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthCommandeGuard]
    });
  });

  it('should ...', inject([AuthCommandeGuard], (guard: AuthCommandeGuard) => {
    expect(guard).toBeTruthy();
  }));
});
