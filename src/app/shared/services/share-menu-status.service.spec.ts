import { TestBed } from '@angular/core/testing';

import { ShareMenuStatusService } from './share-menu-status.service';

describe('ShareMenuStatusService', () => {
  let service: ShareMenuStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShareMenuStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
