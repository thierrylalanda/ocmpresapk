import { TestBed } from '@angular/core/testing';

import { TextToSpeekService } from './text-to-speek.service';

describe('TextToSpeekService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TextToSpeekService = TestBed.get(TextToSpeekService);
    expect(service).toBeTruthy();
  });
});
