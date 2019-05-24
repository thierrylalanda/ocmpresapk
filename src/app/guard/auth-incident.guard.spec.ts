import { TestBed, async, inject } from '@angular/core/testing';

import { AuthIncidentGuard } from './auth-incident.guard';

describe('AuthIncidentGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthIncidentGuard]
    });
  });

  it('should ...', inject([AuthIncidentGuard], (guard: AuthIncidentGuard) => {
    expect(guard).toBeTruthy();
  }));
});
